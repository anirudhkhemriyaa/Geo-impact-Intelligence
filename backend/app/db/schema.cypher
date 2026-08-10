# Neo4j Schema Setup Commands
# Run these in your Neo4j Browser or Cypher Shell

# --- CONSTRAINTS ---

# Ensure unique IDs for all core entities
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT event_id_unique IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT country_id_unique IF NOT EXISTS FOR (c:Country) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT industry_id_unique IF NOT EXISTS FOR (i:Industry) REQUIRE i.id IS UNIQUE;

# --- INDEXES ---

# Fast lookup by name/label
CREATE INDEX entity_name_idx IF NOT EXISTS FOR (e:Entity) ON (e.name);
CREATE INDEX country_code_idx IF NOT EXISTS FOR (c:Country) ON (c.code);
CREATE INDEX event_type_idx IF NOT EXISTS FOR (e:Event) ON (e.type);

# --- ONTOLOGY SEEDING (Example Nodes) ---

# Core Sectors
MERGE (s:Sector {id: 'sec_energy', name: 'Energy', category: 'Energy'})
MERGE (s:Sector {id: 'sec_finance', name: 'Finance', category: 'Finance'})
MERGE (s:Sector {id: 'sec_defense', name: 'Defense', category: 'Industrial'})
MERGE (s:Sector {id: 'sec_tech', name: 'Technology', category: 'Technology'})
MERGE (s:Sector {id: 'sec_transport', name: 'Transportation', category: 'Logistics'});

# Core Industries
MERGE (i:Industry {id: 'ind_oil_gas', name: 'Oil & Gas'})-[:BELONGS_TO]->(s:Sector {id: 'sec_energy'})
MERGE (i:Industry {id: 'ind_banking', name: 'Banking'})-[:BELONGS_TO]->(s:Sector {id: 'sec_finance'})
MERGE (i:Industry {id: 'ind_airlines', name: 'Airlines'})-[:BELONGS_TO]->(s:Sector {id: 'sec_transport'})
MERGE (i:Industry {id: 'ind_aerospace_defense', name: 'Aerospace & Defense'})-[:BELONGS_TO]->(s:Sector {id: 'sec_defense'});

# Core Mechanisms from Ontology
MERGE (m1:Mechanism {id: 'military_escalation', name: 'Military Escalation'})
MERGE (m2:Mechanism {id: 'shipping_disruption', name: 'Shipping Disruption'})
MERGE (m3:Mechanism {id: 'energy_supply_risk', name: 'Energy Supply Risk'})
MERGE (m4:Mechanism {id: 'infrastructure_damage', name: 'Infrastructure Damage'})

# Vulnerability Mapping (Mechanism -> Industry)
MERGE (i_def:Industry {id: 'ind_aerospace_defense'})-[:BENEFITS_FROM]->(m1)
MERGE (i_air:Industry {id: 'ind_airlines'})-[:VULNERABLE_TO]->(m2)
MERGE (i_air)-[:VULNERABLE_TO]->(m3)
MERGE (i_oil:Industry {id: 'ind_oil_gas'})-[:BENEFITS_FROM]->(m3)
MERGE (i_bank:Industry {id: 'ind_banking'})-[:VULNERABLE_TO]->(m4)
