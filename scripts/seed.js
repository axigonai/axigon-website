const { connectToDatabase } = require('../lib/db');
const AgentModel = require('../models/Agent');

// Initial AI agents from your frontend
const initialAgents = [
  {
    name: 'ContractAI',
    domain: 'Legal Analysis',
    description: 'Extract obligations, risks, and key terms from complex legal documents',
    features: [
      'Automated contract review',
      'Risk identification',
      'Clause extraction',
      'Compliance checking'
    ],
    capabilities: [
      'Natural language processing',
      'Legal terminology understanding',
      'Multi-document analysis'
    ],
    pricing: {
      model: 'subscription',
      price: 499
    }
  },
  {
    name: 'FinanceGPT',
    domain: 'Financial Forecasting',
    description: 'Generate revenue projections and scenario analysis from historical data',
    features: [
      'Revenue forecasting',
      'Scenario modeling',
      'Trend analysis',
      'Financial reporting'
    ],
    capabilities: [
      'Time series analysis',
      'Statistical modeling',
      'Data visualization'
    ],
    pricing: {
      model: 'subscription',
      price: 799
    }
  },
  {
    name: 'ComplianceWatch',
    domain: 'Regulatory Compliance',
    description: 'Monitor regulatory changes and flag compliance gaps',
    features: [
      'Real-time monitoring',
      'Compliance alerts',
      'Regulatory updates',
      'Gap analysis'
    ],
    capabilities: [
      'Regulatory intelligence',
      'Automated scanning',
      'Risk scoring'
    ],
    pricing: {
      model: 'subscription',
      price: 599
    }
  },
  {
    name: 'DataGuard',
    domain: 'Data Quality',
    description: 'Detect anomalies, validate schemas, and ensure data integrity',
    features: [
      'Anomaly detection',
      'Schema validation',
      'Data profiling',
      'Quality scoring'
    ],
    capabilities: [
      'Machine learning detection',
      'Pattern recognition',
      'Automated testing'
    ],
    pricing: {
      model: 'subscription',
      price: 399
    }
  },
  {
    name: 'CustomerInsight',
    domain: 'Customer Intelligence',
    description: 'Analyze customer behavior patterns and predict churn',
    features: [
      'Behavior analysis',
      'Churn prediction',
      'Segmentation',
      'Sentiment analysis'
    ],
    capabilities: [
      'Predictive modeling',
      'Customer journey mapping',
      'Real-time analytics'
    ],
    pricing: {
      model: 'subscription',
      price: 699
    }
  },
  {
    name: 'SupplyChainAI',
    domain: 'Supply Chain',
    description: 'Optimize inventory levels and predict disruptions',
    features: [
      'Inventory optimization',
      'Disruption prediction',
      'Demand forecasting',
      'Route optimization'
    ],
    capabilities: [
      'Optimization algorithms',
      'Predictive analytics',
      'Real-time tracking'
    ],
    pricing: {
      model: 'enterprise',
      price: 1299
    }
  }
];

async function seedAgents() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    const agentModel = new AgentModel(db);

    console.log('Creating indexes...');
    await agentModel.createIndexes();

    console.log('Checking existing agents...');
    const existingAgents = await agentModel.getAll();

    if (existingAgents.length > 0) {
      console.log(`Found ${existingAgents.length} existing agents. Skipping seed.`);
      return;
    }

    console.log('Seeding agents...');
    for (const agentData of initialAgents) {
      const agent = await agentModel.create(agentData);
      console.log(`✓ Created agent: ${agent.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${initialAgents.length} AI agents`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAgents()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedAgents;
