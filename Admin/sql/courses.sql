INSERT INTO public.courses (
  id,
  course_name,
  course_domain,
  description,
  course_level,
  how_many_weeks,
  total_enrolled,
  course_array,
  course_week_array,
  course_logo,
  domain_id,
  courseFee,
  created_at
)
VALUES

-- 1️⃣ Prompt Engineering & LLM Mastery
(
  '070c6718-6c4b-48bc-af39-39b91c862478',
  'Prompt Engineering & LLM Mastery',
  'Generative AI',
  'Master the art of prompt engineering with GPT-4, Claude, and other LLMs.',
  'Beginner to Advanced',
  6,
  600,
  ARRAY[
    'GPT-4 & Claude expertise',
    'Advanced prompting strategies',
    'AI app development',
    'Chain-of-thought reasoning'
  ],
  ARRAY[
    '{"week":1,"title":"LLM Fundamentals","week_array":["What are LLMs","Transformers","Capabilities"],"description":"LLM basics"}'::jsonb,
    '{"week":2,"title":"Prompt Basics","week_array":["Zero-shot","Few-shot"],"description":"Prompt foundations"}'::jsonb,
    '{"week":3,"title":"Advanced Prompting","week_array":["Chain-of-thought","Role prompts"],"description":"Advanced prompts"}'::jsonb,
    '{"week":4,"title":"LLM APIs","week_array":["OpenAI","Claude"],"description":"API usage"}'::jsonb,
    '{"week":5,"title":"AI Apps","week_array":["RAG","Prompt pipelines"],"description":"App building"}'::jsonb,
    '{"week":6,"title":"Final Project","week_array":["Evaluation","Deployment"],"description":"Capstone"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  2000.00,
  '2025-11-02 12:34:10+00'
),

-- 2️⃣ Deep Learning with Neural Networks
(
  '42aec321-00c3-4873-aa4a-3d8c8f79205d',
  'Deep Learning with Neural Networks',
  'Artificial Intelligence',
  'Deep dive into CNNs, RNNs, and Transformers using TensorFlow and PyTorch.',
  'Advanced',
  12,
  350,
  ARRAY[
    'TensorFlow & PyTorch',
    'Computer Vision',
    'NLP with Transformers',
    'GPU Training'
  ],
  ARRAY[
    '{"week":1,"title":"DL Foundations","week_array":["Neural networks","Workflow"],"description":"Intro"}'::jsonb,
    '{"week":2,"title":"NN Basics","week_array":["Perceptron","Activation"],"description":"NN learning"}'::jsonb,
    '{"week":3,"title":"Training","week_array":["Backprop","Regularization"],"description":"Training deep nets"}'::jsonb,
    '{"week":4,"title":"Optimization","week_array":["Adam","BatchNorm"],"description":"Optimization"}'::jsonb,
    '{"week":5,"title":"CNNs","week_array":["Convolution","Pooling"],"description":"Vision"}'::jsonb,
    '{"week":6,"title":"Advanced CNNs","week_array":["ResNet","Transfer learning"],"description":"CNN architectures"}'::jsonb,
    '{"week":7,"title":"RNNs","week_array":["Sequences","Time series"],"description":"RNNs"}'::jsonb,
    '{"week":8,"title":"LSTM & GRU","week_array":["LSTM","GRU"],"description":"Long-term deps"}'::jsonb,
    '{"week":9,"title":"Transformers","week_array":["Attention","Self-attention"],"description":"Transformers"}'::jsonb,
    '{"week":10,"title":"NLP","week_array":["BERT","GPT"],"description":"NLP models"}'::jsonb,
    '{"week":11,"title":"Advanced Topics","week_array":["GANs","Autoencoders"],"description":"Advanced DL"}'::jsonb,
    '{"week":12,"title":"Final Project","week_array":["Deployment","Optimization"],"description":"Capstone"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  NULL,
  '2025-11-02 12:29:40+00'
),

-- 3️⃣ Machine Learning Fundamentals
(
  '6ac54eee-e694-4fad-af55-07793a658bd1',
  'Machine Learning Fundamentals',
  'Artificial Intelligence',
  'Comprehensive introduction to machine learning algorithms.',
  'Intermediate',
  10,
  451,
  ARRAY[
    'Supervised learning',
    'Unsupervised learning',
    'Scikit-learn',
    'ML projects'
  ],
  ARRAY[
    '{"week":1,"title":"Intro ML","week_array":["What is ML","Types"],"description":"Basics"}'::jsonb,
    '{"week":2,"title":"Python Tools","week_array":["NumPy","Pandas"],"description":"Tooling"}'::jsonb,
    '{"week":3,"title":"Preprocessing","week_array":["Scaling","Encoding"],"description":"Data prep"}'::jsonb,
    '{"week":4,"title":"Regression","week_array":["Linear","Polynomial"],"description":"Regression"}'::jsonb,
    '{"week":5,"title":"Classification","week_array":["Logistic","Trees"],"description":"Classification"}'::jsonb,
    '{"week":6,"title":"Ensemble","week_array":["RF","Boosting"],"description":"Ensembles"}'::jsonb,
    '{"week":7,"title":"Unsupervised","week_array":["KMeans","DBSCAN"],"description":"Clustering"}'::jsonb,
    '{"week":8,"title":"Evaluation","week_array":["CV","GridSearch"],"description":"Evaluation"}'::jsonb,
    '{"week":9,"title":"Deployment","week_array":["Pipelines","Monitoring"],"description":"Deployment"}'::jsonb,
    '{"week":10,"title":"Final Project","week_array":["End-to-end"],"description":"Capstone"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  NULL,
  '2025-11-02 12:25:36+00'
),

-- 4️⃣ SQL & Database Management
(
  'c372e33f-a304-490a-ab2d-51f2406dcabe',
  'SQL & Database Management',
  'Data Engineering',
  'Master SQL, database design, and optimization.',
  'Beginner to Intermediate',
  6,
  552,
  ARRAY[
    'Advanced SQL',
    'Database design',
    'PostgreSQL',
    'Query optimization'
  ],
  ARRAY[
    '{"week":1,"title":"DB Basics","week_array":["DBMS","SQL intro"],"description":"Fundamentals"}'::jsonb,
    '{"week":2,"title":"SQL Basics","week_array":["SELECT","INSERT"],"description":"CRUD"}'::jsonb,
    '{"week":3,"title":"Joins","week_array":["INNER","LEFT"],"description":"Joins"}'::jsonb,
    '{"week":4,"title":"Design","week_array":["Normalization","Keys"],"description":"Schema"}'::jsonb,
    '{"week":5,"title":"Optimization","week_array":["Indexes","Windows"],"description":"Performance"}'::jsonb,
    '{"week":6,"title":"Final Project","week_array":["Transactions","NoSQL"],"description":"Capstone"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  NULL,
  '2025-11-02 12:42:15+00'
),

-- 5️⃣ Python for Data Science
(
  'c632dfe0-d5e7-453b-8ad0-05573e7bb2e2',
  'Python for Data Science',
  'Data Science & Analytics',
  'Python programming for analytics and visualization.',
  'Beginner to Intermediate',
  8,
  501,
  ARRAY[
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Capstone project'
  ],
  ARRAY[
    '{"week":1,"title":"Python Basics","week_array":["Syntax","Functions"],"description":"Basics"}'::jsonb,
    '{"week":2,"title":"Advanced Python","week_array":["OOP","Files"],"description":"Advanced"}'::jsonb,
    '{"week":3,"title":"NumPy","week_array":["Arrays","Broadcasting"],"description":"Numerical"}'::jsonb,
    '{"week":4,"title":"Pandas","week_array":["DataFrames","Cleaning"],"description":"Analysis"}'::jsonb,
    '{"week":5,"title":"Matplotlib","week_array":["Plots","Customization"],"description":"Visualization"}'::jsonb,
    '{"week":6,"title":"Seaborn","week_array":["EDA","Heatmaps"],"description":"Stats viz"}'::jsonb,
    '{"week":7,"title":"EDA","week_array":["Outliers","Pipelines"],"description":"EDA"}'::jsonb,
    '{"week":8,"title":"Capstone","week_array":["Project","Presentation"],"description":"Final"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  4000.00,
  '2025-11-02 12:19:14+00'
),

-- 6️⃣ Data Visualization Mastery
(
  'd02a0b60-3b74-4458-a62a-da2e5afc0280',
  'Data Visualization Mastery',
  'Data Science & Analytics',
  'Create stunning dashboards and visual stories.',
  'Intermediate',
  6,
  400,
  ARRAY[
    'Tableau',
    'Power BI',
    'D3.js',
    'Storytelling'
  ],
  ARRAY[
    '{"week":1,"title":"Viz Foundations","week_array":["Charts","Color theory"],"description":"Foundations"}'::jsonb,
    '{"week":2,"title":"Python Viz","week_array":["Matplotlib","Seaborn"],"description":"Python viz"}'::jsonb,
    '{"week":3,"title":"Tableau","week_array":["Dashboards","Publishing"],"description":"Tableau"}'::jsonb,
    '{"week":4,"title":"Power BI","week_array":["DAX","Reports"],"description":"Power BI"}'::jsonb,
    '{"week":5,"title":"D3.js","week_array":["SVG","Interactivity"],"description":"Web viz"}'::jsonb,
    '{"week":6,"title":"Capstone","week_array":["Storytelling","UX"],"description":"Final"}'::jsonb
  ]::jsonb[],
  NULL,
  NULL,
  3000.00,
  '2025-11-02 12:38:42+00'
);
