// Vocabulary Data Structure
const vocabularyData = {
    parts: [
        {
            id: 1,
            title: "Technology & AI",
            description: "Essential technology and artificial intelligence terminology",
            wordRange: "Words 1-200",
            batches: [
                {
                    id: 1,
                    title: "Core AI & ML - Batch 1",
                    range: "1-25",
                    words: [
                        { word: "Algorithm", phonetic: "/ˈælɡərɪðəm/", definition: "A step-by-step procedure for solving a problem", example: "The search algorithm finds the best results quickly.", partOfSpeech: "noun" },
                        { word: "Artificial", phonetic: "/ˌɑːrtɪˈfɪʃəl/", definition: "Made by humans rather than occurring naturally", example: "Artificial intelligence mimics human thinking.", partOfSpeech: "adjective" },
                        { word: "Machine", phonetic: "/məˈʃiːn/", definition: "A device that performs tasks automatically", example: "The machine learning model improves with data.", partOfSpeech: "noun" },
                        { word: "Learning", phonetic: "/ˈlɜːrnɪŋ/", definition: "The process of acquiring knowledge or skills", example: "Deep learning requires large datasets.", partOfSpeech: "noun" },
                        { word: "Neural", phonetic: "/ˈnʊrəl/", definition: "Relating to nerves or the nervous system", example: "Neural networks process information like the brain.", partOfSpeech: "adjective" },
                        { word: "Network", phonetic: "/ˈnetwɜːrk/", definition: "A system of interconnected elements", example: "The neural network recognized the image.", partOfSpeech: "noun" },
                        { word: "Data", phonetic: "/ˈdeɪtə/", definition: "Information processed by computers", example: "Big data analytics reveals hidden patterns.", partOfSpeech: "noun" },
                        { word: "Training", phonetic: "/ˈtreɪnɪŋ/", definition: "The process of teaching a model", example: "Model training takes several hours.", partOfSpeech: "noun" },
                        { word: "Model", phonetic: "/ˈmɑːdl/", definition: "A mathematical representation of a process", example: "The AI model predicts weather patterns.", partOfSpeech: "noun" },
                        { word: "Prediction", phonetic: "/prɪˈdɪkʃən/", definition: "A forecast about future events", example: "The model's prediction was accurate.", partOfSpeech: "noun" },
                        { word: "Classification", phonetic: "/ˌklæsɪfɪˈkeɪʃən/", definition: "The process of categorizing data", example: "Image classification identifies objects.", partOfSpeech: "noun" },
                        { word: "Regression", phonetic: "/rɪˈɡreʃən/", definition: "A statistical method for prediction", example: "Linear regression predicts continuous values.", partOfSpeech: "noun" },
                        { word: "Supervised", phonetic: "/ˈsuːpərvaɪzd/", definition: "Learning with labeled training data", example: "Supervised learning uses known answers.", partOfSpeech: "adjective" },
                        { word: "Unsupervised", phonetic: "/ˌʌnˈsuːpərvaɪzd/", definition: "Learning without labeled data", example: "Unsupervised learning finds hidden patterns.", partOfSpeech: "adjective" },
                        { word: "Feature", phonetic: "/ˈfiːtʃər/", definition: "An individual measurable property", example: "Age is a feature in the dataset.", partOfSpeech: "noun" },
                        { word: "Dataset", phonetic: "/ˈdeɪtəset/", definition: "A collection of data for analysis", example: "The dataset contains customer information.", partOfSpeech: "noun" },
                        { word: "Accuracy", phonetic: "/ˈækjərəsi/", definition: "The degree of correctness", example: "The model achieved 95% accuracy.", partOfSpeech: "noun" },
                        { word: "Validation", phonetic: "/ˌvælɪˈdeɪʃən/", definition: "Testing model performance", example: "Validation ensures the model generalizes well.", partOfSpeech: "noun" },
                        { word: "Optimization", phonetic: "/ˌɑːptɪməˈzeɪʃən/", definition: "The process of making something as effective as possible", example: "Optimization improves model performance.", partOfSpeech: "noun" },
                        { word: "Gradient", phonetic: "/ˈɡreɪdiənt/", definition: "A measure of how a function changes", example: "Gradient descent finds the optimal solution.", partOfSpeech: "noun" },
                        { word: "Parameter", phonetic: "/pəˈræmɪtər/", definition: "A numerical value that defines a model", example: "The model has millions of parameters.", partOfSpeech: "noun" },
                        { word: "Hyperparameter", phonetic: "/ˌhaɪpərpəˈræmɪtər/", definition: "A configuration setting for learning", example: "Learning rate is a crucial hyperparameter.", partOfSpeech: "noun" },
                        { word: "Overfitting", phonetic: "/ˈoʊvərfɪtɪŋ/", definition: "When a model learns training data too well", example: "Overfitting reduces generalization ability.", partOfSpeech: "noun" },
                        { word: "Underfitting", phonetic: "/ˈʌndərfɪtɪŋ/", definition: "When a model is too simple to capture patterns", example: "Underfitting leads to poor performance.", partOfSpeech: "noun" },
                        { word: "Clustering", phonetic: "/ˈklʌstərɪŋ/", definition: "Grouping similar data points together", example: "Clustering reveals customer segments.", partOfSpeech: "noun" }
                    ]
                },
                {
                    id: 2,
                    title: "Core AI & ML - Batch 2",
                    range: "26-50",
                    words: [
                        { word: "Deep", phonetic: "/diːp/", definition: "Having many layers or levels", example: "Deep learning uses multiple hidden layers.", partOfSpeech: "adjective" },
                        { word: "Convolutional", phonetic: "/ˌkɑːnvəˈluːʃənəl/", definition: "A type of neural network for image processing", example: "Convolutional networks excel at image recognition.", partOfSpeech: "adjective" },
                        { word: "Recurrent", phonetic: "/rɪˈkɜːrənt/", definition: "Occurring repeatedly in cycles", example: "Recurrent networks process sequential data.", partOfSpeech: "adjective" },
                        { word: "Transformer", phonetic: "/trænsˈfɔːrmər/", definition: "An attention-based neural network architecture", example: "Transformers revolutionized natural language processing.", partOfSpeech: "noun" },
                        { word: "Attention", phonetic: "/əˈtenʃən/", definition: "A mechanism to focus on relevant parts", example: "Attention mechanisms improve translation quality.", partOfSpeech: "noun" },
                        { word: "Embedding", phonetic: "/ɪmˈbedɪŋ/", definition: "A dense vector representation of data", example: "Word embeddings capture semantic meaning.", partOfSpeech: "noun" },
                        { word: "Tokenization", phonetic: "/ˌtoʊkənaɪˈzeɪʃən/", definition: "Breaking text into smaller units", example: "Tokenization splits sentences into words.", partOfSpeech: "noun" },
                        { word: "Preprocessing", phonetic: "/ˌpriːˈproʊsesɪŋ/", definition: "Preparing data before analysis", example: "Data preprocessing improves model performance.", partOfSpeech: "noun" },
                        { word: "Normalization", phonetic: "/ˌnɔːrməlaɪˈzeɪʃən/", definition: "Scaling data to a standard range", example: "Normalization prevents feature dominance.", partOfSpeech: "noun" },
                        { word: "Regularization", phonetic: "/ˌreɡjələraɪˈzeɪʃən/", definition: "Techniques to prevent overfitting", example: "L2 regularization penalizes large weights.", partOfSpeech: "noun" },
                        { word: "Dropout", phonetic: "/ˈdrɑːpaʊt/", definition: "A regularization technique", example: "Dropout randomly disables neurons during training.", partOfSpeech: "noun" },
                        { word: "Epoch", phonetic: "/ˈiːpɑːk/", definition: "One complete pass through the training data", example: "The model trained for 100 epochs.", partOfSpeech: "noun" },
                        { word: "Batch", phonetic: "/bætʃ/", definition: "A subset of training data", example: "Mini-batch training improves efficiency.", partOfSpeech: "noun" },
                        { word: "Backpropagation", phonetic: "/ˌbækprɑːpəˈɡeɪʃən/", definition: "Algorithm for training neural networks", example: "Backpropagation calculates gradients efficiently.", partOfSpeech: "noun" },
                        { word: "Activation", phonetic: "/ˌæktɪˈveɪʃən/", definition: "A function that introduces non-linearity", example: "ReLU is a popular activation function.", partOfSpeech: "noun" },
                        { word: "Sigmoid", phonetic: "/ˈsɪɡmɔɪd/", definition: "An S-shaped mathematical function", example: "Sigmoid activation maps inputs to 0-1 range.", partOfSpeech: "noun" },
                        { word: "Softmax", phonetic: "/ˈsɔːftmæks/", definition: "A function that converts scores to probabilities", example: "Softmax is used in multi-class classification.", partOfSpeech: "noun" },
                        { word: "Loss", phonetic: "/lɔːs/", definition: "A measure of prediction error", example: "Cross-entropy loss measures classification error.", partOfSpeech: "noun" },
                        { word: "Optimizer", phonetic: "/ˈɑːptɪmaɪzər/", definition: "An algorithm that updates model parameters", example: "Adam optimizer adapts learning rates.", partOfSpeech: "noun" },
                        { word: "Momentum", phonetic: "/moʊˈmentəm/", definition: "A technique to accelerate optimization", example: "Momentum helps escape local minima.", partOfSpeech: "noun" },
                        { word: "Inference", phonetic: "/ˈɪnfərəns/", definition: "Making predictions with a trained model", example: "Inference time should be optimized for production.", partOfSpeech: "noun" },
                        { word: "Deployment", phonetic: "/dɪˈplɔɪmənt/", definition: "Putting a model into production use", example: "Model deployment requires careful monitoring.", partOfSpeech: "noun" },
                        { word: "Pipeline", phonetic: "/ˈpaɪplaɪn/", definition: "A series of data processing steps", example: "The ML pipeline automates model training.", partOfSpeech: "noun" },
                        { word: "Framework", phonetic: "/ˈfreɪmwɜːrk/", definition: "A software platform for development", example: "TensorFlow is a popular ML framework.", partOfSpeech: "noun" },
                        { word: "API", phonetic: "/ˌeɪpiːˈaɪ/", definition: "Application Programming Interface", example: "The API provides access to the model.", partOfSpeech: "noun" }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "IT Infrastructure & Security",
            description: "Essential IT infrastructure and cybersecurity terminology",
            wordRange: "Words 201-400",
            batches: [
                {
                    id: 9,
                    title: "Infrastructure Essentials - Batch 9",
                    range: "201-225",
                    words: [
                        { word: "Infrastructure", phonetic: "/ˈɪnfrəstrʌktʃər/", definition: "The basic physical and organizational structures", example: "Cloud infrastructure provides scalable computing resources.", partOfSpeech: "noun" },
                        { word: "Server", phonetic: "/ˈsɜːrvər/", definition: "A computer that provides services to other computers", example: "The web server handles HTTP requests.", partOfSpeech: "noun" },
                        { word: "Database", phonetic: "/ˈdeɪtəbeɪs/", definition: "A structured collection of data", example: "The database stores customer information.", partOfSpeech: "noun" },
                        { word: "Network", phonetic: "/ˈnetwɜːrk/", definition: "A system of interconnected computers", example: "The corporate network connects all offices.", partOfSpeech: "noun" },
                        { word: "Protocol", phonetic: "/ˈproʊtəkɔːl/", definition: "A set of rules for communication", example: "HTTP protocol enables web communication.", partOfSpeech: "noun" },
                        { word: "Router", phonetic: "/ˈruːtər/", definition: "A device that forwards data between networks", example: "The router directs traffic to the correct destination.", partOfSpeech: "noun" },
                        { word: "Switch", phonetic: "/swɪtʃ/", definition: "A device that connects devices in a network", example: "The network switch connects multiple computers.", partOfSpeech: "noun" },
                        { word: "Firewall", phonetic: "/ˈfaɪərwɔːl/", definition: "A security system that monitors network traffic", example: "The firewall blocks unauthorized access.", partOfSpeech: "noun" },
                        { word: "Load", phonetic: "/loʊd/", definition: "The amount of work assigned to a system", example: "Load balancing distributes traffic evenly.", partOfSpeech: "noun" },
                        { word: "Scalability", phonetic: "/ˌskeɪləˈbɪlɪti/", definition: "The ability to handle increased workload", example: "Cloud services offer excellent scalability.", partOfSpeech: "noun" },
                        { word: "Bandwidth", phonetic: "/ˈbændwɪdθ/", definition: "The maximum data transfer rate", example: "High bandwidth enables fast file transfers.", partOfSpeech: "noun" },
                        { word: "Latency", phonetic: "/ˈleɪtənsi/", definition: "The delay in data transmission", example: "Low latency is crucial for real-time applications.", partOfSpeech: "noun" },
                        { word: "Throughput", phonetic: "/ˈθruːpʊt/", definition: "The amount of data processed per unit time", example: "System throughput measures processing capacity.", partOfSpeech: "noun" },
                        { word: "Redundancy", phonetic: "/rɪˈdʌndənsi/", definition: "Backup systems to prevent failure", example: "Redundancy ensures system availability.", partOfSpeech: "noun" },
                        { word: "Failover", phonetic: "/ˈfeɪloʊvər/", definition: "Switching to backup systems during failure", example: "Automatic failover minimizes downtime.", partOfSpeech: "noun" },
                        { word: "Backup", phonetic: "/ˈbækʌp/", definition: "A copy of data for protection", example: "Regular backups prevent data loss.", partOfSpeech: "noun" },
                        { word: "Recovery", phonetic: "/rɪˈkʌvəri/", definition: "The process of restoring normal operations", example: "Disaster recovery plans ensure business continuity.", partOfSpeech: "noun" },
                        { word: "Monitoring", phonetic: "/ˈmɑːnɪtərɪŋ/", definition: "Continuous observation of system performance", example: "Network monitoring detects performance issues.", partOfSpeech: "noun" },
                        { word: "Virtualization", phonetic: "/ˌvɜːrtʃuələˈzeɪʃən/", definition: "Creating virtual versions of physical resources", example: "Virtualization maximizes hardware utilization.", partOfSpeech: "noun" },
                        { word: "Container", phonetic: "/kənˈteɪnər/", definition: "A lightweight virtualization technology", example: "Docker containers simplify application deployment.", partOfSpeech: "noun" },
                        { word: "Orchestration", phonetic: "/ˌɔːrkɪˈstreɪʃən/", definition: "Automated management of complex systems", example: "Kubernetes provides container orchestration.", partOfSpeech: "noun" },
                        { word: "Microservices", phonetic: "/ˈmaɪkroʊsɜːrvɪsɪz/", definition: "Small, independent service components", example: "Microservices architecture improves scalability.", partOfSpeech: "noun" },
                        { word: "API", phonetic: "/ˌeɪpiːˈaɪ/", definition: "Application Programming Interface", example: "APIs enable communication between services.", partOfSpeech: "noun" },
                        { word: "Gateway", phonetic: "/ˈɡeɪtweɪ/", definition: "A point of entry to another network", example: "The API gateway manages service requests.", partOfSpeech: "noun" },
                        { word: "Proxy", phonetic: "/ˈprɑːksi/", definition: "An intermediary server", example: "The proxy server caches frequently requested content.", partOfSpeech: "noun" }
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Business & Management",
            description: "Essential business operations and strategic management terminology",
            wordRange: "Words 401-600",
            batches: [
                {
                    id: 17,
                    title: "Business Operations - Batch 17",
                    range: "401-425",
                    words: [
                        { word: "Revenue", phonetic: "/ˈrevənjuː/", definition: "Income generated from business operations", example: "The company's revenue increased by 15% this quarter.", partOfSpeech: "noun" },
                        { word: "Profit", phonetic: "/ˈprɑːfɪt/", definition: "Financial gain after expenses", example: "The profit margin improved with cost reduction.", partOfSpeech: "noun" },
                        { word: "Efficiency", phonetic: "/ɪˈfɪʃənsi/", definition: "Achieving maximum output with minimum input", example: "Process efficiency reduces operational costs.", partOfSpeech: "noun" },
                        { word: "Productivity", phonetic: "/ˌproʊdʌkˈtɪvɪti/", definition: "The rate of output per unit of input", example: "Employee productivity increased with new tools.", partOfSpeech: "noun" },
                        { word: "Optimization", phonetic: "/ˌɑːptɪməˈzeɪʃən/", definition: "Making something as effective as possible", example: "Supply chain optimization reduces costs.", partOfSpeech: "noun" },
                        { word: "Stakeholder", phonetic: "/ˈsteɪkhoʊldər/", definition: "A person with interest in an organization", example: "All stakeholders were consulted on the decision.", partOfSpeech: "noun" },
                        { word: "Compliance", phonetic: "/kəmˈplaɪəns/", definition: "Conforming to rules and regulations", example: "Regulatory compliance is essential for operations.", partOfSpeech: "noun" },
                        { word: "Governance", phonetic: "/ˈɡʌvərnəns/", definition: "The system of rules and processes", example: "Good governance ensures ethical business practices.", partOfSpeech: "noun" },
                        { word: "Strategy", phonetic: "/ˈstrætədʒi/", definition: "A plan to achieve long-term goals", example: "The marketing strategy targets young professionals.", partOfSpeech: "noun" },
                        { word: "Innovation", phonetic: "/ˌɪnəˈveɪʃən/", definition: "The introduction of new ideas or methods", example: "Innovation drives competitive advantage.", partOfSpeech: "noun" },
                        { word: "Sustainability", phonetic: "/səˌsteɪnəˈbɪlɪti/", definition: "The ability to maintain operations long-term", example: "Environmental sustainability is a corporate priority.", partOfSpeech: "noun" },
                        { word: "Leadership", phonetic: "/ˈliːdərʃɪp/", definition: "The ability to guide and influence others", example: "Strong leadership motivates team performance.", partOfSpeech: "noun" },
                        { word: "Collaboration", phonetic: "/kəˌlæbəˈreɪʃən/", definition: "Working together to achieve common goals", example: "Cross-team collaboration improves project outcomes.", partOfSpeech: "noun" },
                        { word: "Communication", phonetic: "/kəˌmjuːnɪˈkeɪʃən/", definition: "The exchange of information", example: "Clear communication prevents misunderstandings.", partOfSpeech: "noun" },
                        { word: "Negotiation", phonetic: "/nɪˌɡoʊʃiˈeɪʃən/", definition: "Discussion to reach an agreement", example: "Contract negotiation requires careful preparation.", partOfSpeech: "noun" },
                        { word: "Decision", phonetic: "/dɪˈsɪʒən/", definition: "A choice made after consideration", example: "Data-driven decisions improve business outcomes.", partOfSpeech: "noun" },
                        { word: "Implementation", phonetic: "/ˌɪmplɪmənˈteɪʃən/", definition: "The process of putting plans into action", example: "Strategy implementation requires careful planning.", partOfSpeech: "noun" },
                        { word: "Execution", phonetic: "/ˌeksɪˈkjuːʃən/", definition: "The act of carrying out a plan", example: "Project execution exceeded expectations.", partOfSpeech: "noun" },
                        { word: "Performance", phonetic: "/pərˈfɔːrməns/", definition: "The accomplishment of work or tasks", example: "Employee performance is evaluated quarterly.", partOfSpeech: "noun" },
                        { word: "Accountability", phonetic: "/əˌkaʊntəˈbɪlɪti/", definition: "Taking responsibility for outcomes", example: "Clear accountability structures improve results.", partOfSpeech: "noun" },
                        { word: "Transparency", phonetic: "/trænsˈpærənsi/", definition: "Openness and honesty in communication", example: "Financial transparency builds investor trust.", partOfSpeech: "noun" },
                        { word: "Integrity", phonetic: "/ɪnˈteɡrɪti/", definition: "Honesty and moral principles", example: "Business integrity is essential for reputation.", partOfSpeech: "noun" },
                        { word: "Ethics", phonetic: "/ˈeθɪks/", definition: "Moral principles governing behavior", example: "Business ethics guide decision-making.", partOfSpeech: "noun" },
                        { word: "Culture", phonetic: "/ˈkʌltʃər/", definition: "The shared values and practices", example: "Company culture influences employee satisfaction.", partOfSpeech: "noun" },
                        { word: "Diversity", phonetic: "/daɪˈvɜːrsɪti/", definition: "The inclusion of different types of people", example: "Workplace diversity enhances creativity.", partOfSpeech: "noun" }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Communication & Soft Skills",
            description: "Professional communication and presentation skills terminology",
            wordRange: "Words 601-800",
            batches: [
                {
                    id: 25,
                    title: "Professional Communication - Batch 25",
                    range: "601-625",
                    words: [
                        { word: "Articulate", phonetic: "/ɑːrˈtɪkjələt/", definition: "Express ideas clearly and effectively", example: "She can articulate complex concepts simply.", partOfSpeech: "verb" },
                        { word: "Eloquent", phonetic: "/ˈeləkwənt/", definition: "Fluent and persuasive in speaking", example: "His eloquent speech moved the audience.", partOfSpeech: "adjective" },
                        { word: "Persuasive", phonetic: "/pərˈsweɪsɪv/", definition: "Good at convincing others", example: "The persuasive presentation won the contract.", partOfSpeech: "adjective" },
                        { word: "Compelling", phonetic: "/kəmˈpelɪŋ/", definition: "Evoking interest or attention", example: "The compelling argument changed their minds.", partOfSpeech: "adjective" },
                        { word: "Concise", phonetic: "/kənˈsaɪs/", definition: "Brief and clearly expressed", example: "Keep your email concise and to the point.", partOfSpeech: "adjective" },
                        { word: "Coherent", phonetic: "/koʊˈhɪrənt/", definition: "Logical and consistent", example: "Her coherent explanation clarified the issue.", partOfSpeech: "adjective" },
                        { word: "Clarity", phonetic: "/ˈklærɪti/", definition: "The quality of being clear", example: "Message clarity prevents misunderstandings.", partOfSpeech: "noun" },
                        { word: "Precision", phonetic: "/prɪˈsɪʒən/", definition: "Exactness and accuracy", example: "Technical writing requires precision.", partOfSpeech: "noun" },
                        { word: "Rapport", phonetic: "/ræˈpɔːr/", definition: "A close and harmonious relationship", example: "Building rapport with clients is essential.", partOfSpeech: "noun" },
                        { word: "Empathy", phonetic: "/ˈempəθi/", definition: "Understanding others' feelings", example: "Empathy improves customer relationships.", partOfSpeech: "noun" },
                        { word: "Diplomacy", phonetic: "/dɪˈploʊməsi/", definition: "Skill in handling people tactfully", example: "Diplomacy is crucial in conflict resolution.", partOfSpeech: "noun" },
                        { word: "Tact", phonetic: "/tækt/", definition: "Sensitivity in dealing with others", example: "She handled the situation with great tact.", partOfSpeech: "noun" },
                        { word: "Assertive", phonetic: "/əˈsɜːrtɪv/", definition: "Confident and direct", example: "Be assertive when stating your requirements.", partOfSpeech: "adjective" },
                        { word: "Diplomatic", phonetic: "/ˌdɪpləˈmætɪk/", definition: "Skilled in managing relationships", example: "A diplomatic approach resolved the dispute.", partOfSpeech: "adjective" },
                        { word: "Feedback", phonetic: "/ˈfiːdbæk/", definition: "Information about performance", example: "Constructive feedback helps improvement.", partOfSpeech: "noun" },
                        { word: "Constructive", phonetic: "/kənˈstrʌktɪv/", definition: "Helpful and intended to improve", example: "Constructive criticism aids development.", partOfSpeech: "adjective" },
                        { word: "Dialogue", phonetic: "/ˈdaɪəlɔːɡ/", definition: "A conversation between parties", example: "Open dialogue promotes understanding.", partOfSpeech: "noun" },
                        { word: "Discourse", phonetic: "/ˈdɪskɔːrs/", definition: "Written or spoken communication", example: "Professional discourse requires proper etiquette.", partOfSpeech: "noun" },
                        { word: "Etiquette", phonetic: "/ˈetɪkət/", definition: "Conventional rules of behavior", example: "Business etiquette varies across cultures.", partOfSpeech: "noun" },
                        { word: "Protocol", phonetic: "/ˈproʊtəkɔːl/", definition: "Formal rules of procedure", example: "Follow company protocol for meetings.", partOfSpeech: "noun" },
                        { word: "Courtesy", phonetic: "/ˈkɜːrtəsi/", definition: "Polite and respectful behavior", example: "Common courtesy improves workplace relationships.", partOfSpeech: "noun" },
                        { word: "Respect", phonetic: "/rɪˈspekt/", definition: "Regard for others' feelings or rights", example: "Mutual respect is essential for teamwork.", partOfSpeech: "noun" },
                        { word: "Professionalism", phonetic: "/prəˈfeʃənəlɪzəm/", definition: "Competent and appropriate behavior", example: "Professionalism is expected in client meetings.", partOfSpeech: "noun" },
                        { word: "Credibility", phonetic: "/ˌkredəˈbɪlɪti/", definition: "The quality of being trustworthy", example: "Accurate information builds credibility.", partOfSpeech: "noun" },
                        { word: "Influence", phonetic: "/ˈɪnfluəns/", definition: "The power to affect others", example: "Leaders use influence to motivate teams.", partOfSpeech: "noun" }
                    ]
                }
            ]
        },
        {
            id: 5,
            title: "Industry-Specific Terms",
            description: "Finance, analytics, and project management terminology",
            wordRange: "Words 801-1000",
            batches: [
                {
                    id: 33,
                    title: "Finance & Analytics - Batch 33",
                    range: "801-825",
                    words: [
                        { word: "Revenue", phonetic: "/ˈrevənjuː/", definition: "Income generated from business operations", example: "Annual revenue exceeded expectations.", partOfSpeech: "noun" },
                        { word: "Expenditure", phonetic: "/ɪkˈspendɪtʃər/", definition: "The action of spending money", example: "Capital expenditure was approved for equipment.", partOfSpeech: "noun" },
                        { word: "Investment", phonetic: "/ɪnˈvestmənt/", definition: "The allocation of resources for future benefit", example: "Technology investment improved efficiency.", partOfSpeech: "noun" },
                        { word: "Portfolio", phonetic: "/pɔːrtˈfoʊlioʊ/", definition: "A collection of investments", example: "The investment portfolio is well-diversified.", partOfSpeech: "noun" },
                        { word: "Diversification", phonetic: "/daɪˌvɜːrsɪfɪˈkeɪʃən/", definition: "Spreading investments to reduce risk", example: "Diversification protects against market volatility.", partOfSpeech: "noun" },
                        { word: "Volatility", phonetic: "/ˌvɑːləˈtɪlɪti/", definition: "The degree of price fluctuation", example: "Market volatility affects investment decisions.", partOfSpeech: "noun" },
                        { word: "Liquidity", phonetic: "/lɪˈkwɪdɪti/", definition: "The ease of converting assets to cash", example: "High liquidity ensures financial flexibility.", partOfSpeech: "noun" },
                        { word: "Profitability", phonetic: "/ˌprɑːfɪtəˈbɪlɪti/", definition: "The ability to generate profit", example: "Project profitability was carefully analyzed.", partOfSpeech: "noun" },
                        { word: "Margin", phonetic: "/ˈmɑːrdʒɪn/", definition: "The difference between cost and selling price", example: "Profit margins improved this quarter.", partOfSpeech: "noun" },
                        { word: "Valuation", phonetic: "/ˌvæljuˈeɪʃən/", definition: "The estimation of worth", example: "Company valuation increased after the merger.", partOfSpeech: "noun" },
                        { word: "Depreciation", phonetic: "/dɪˌpriːʃiˈeɪʃən/", definition: "The decrease in value over time", example: "Asset depreciation is accounted for annually.", partOfSpeech: "noun" },
                        { word: "Amortization", phonetic: "/əˌmɔːrtəˈzeɪʃən/", definition: "The gradual paying off of debt", example: "Loan amortization schedule shows payment breakdown.", partOfSpeech: "noun" },
                        { word: "Capitalization", phonetic: "/ˌkæpɪtəlaɪˈzeɪʃən/", definition: "The provision of capital for a company", example: "Market capitalization reflects company value.", partOfSpeech: "noun" },
                        { word: "Equity", phonetic: "/ˈekwɪti/", definition: "Ownership interest in a company", example: "Equity financing doesn't require debt repayment.", partOfSpeech: "noun" },
                        { word: "Liability", phonetic: "/ˌlaɪəˈbɪlɪti/", definition: "A company's financial obligations", example: "Current liabilities are due within one year.", partOfSpeech: "noun" },
                        { word: "Asset", phonetic: "/ˈæset/", definition: "A resource with economic value", example: "Intellectual property is an intangible asset.", partOfSpeech: "noun" },
                        { word: "Leverage", phonetic: "/ˈlevərɪdʒ/", definition: "The use of debt to acquire assets", example: "Financial leverage amplifies returns and risks.", partOfSpeech: "noun" },
                        { word: "Hedge", phonetic: "/hedʒ/", definition: "An investment to reduce risk", example: "Currency hedging protects against exchange rate risk.", partOfSpeech: "noun" },
                        { word: "Arbitrage", phonetic: "/ˈɑːrbɪtrɑːʒ/", definition: "Profit from price differences", example: "Arbitrage opportunities exist in inefficient markets.", partOfSpeech: "noun" },
                        { word: "Derivative", phonetic: "/dɪˈrɪvətɪv/", definition: "A financial instrument based on underlying assets", example: "Options are derivative instruments.", partOfSpeech: "noun" },
                        { word: "Benchmark", phonetic: "/ˈbentʃmɑːrk/", definition: "A standard for comparison", example: "The S&P 500 serves as a market benchmark.", partOfSpeech: "noun" },
                        { word: "Correlation", phonetic: "/ˌkɔːrəˈleɪʃən/", definition: "The relationship between variables", example: "Stock prices show correlation with economic indicators.", partOfSpeech: "noun" },
                        { word: "Regression", phonetic: "/rɪˈɡreʃən/", definition: "Statistical method to predict relationships", example: "Regression analysis identified key factors.", partOfSpeech: "noun" },
                        { word: "Forecast", phonetic: "/ˈfɔːrkæst/", definition: "A prediction of future events", example: "The financial forecast predicts growth.", partOfSpeech: "noun" },
                        { word: "Projection", phonetic: "/prəˈdʒekʃən/", definition: "An estimate of future amounts", example: "Sales projections guide budget planning.", partOfSpeech: "noun" }
                    ]
                }
            ]
        }
    ]
};

// Progress tracking data
const progressData = {
    overallProgress: 0,
    completedWords: 0,
    masteredWords: 0,
    difficultWords: 0,
    streak: 0,
    practiceTime: 0,
    accuracyRate: 0,
    userPreferences: {
        autoPlay: true,
        speechSpeed: 1.0,
        practiceMode: 'sequential'
    }
};

// Sample user progress for each word
const userWordProgress = {};

// Initialize progress for all words
vocabularyData.parts.forEach(part => {
    part.batches.forEach(batch => {
        batch.words.forEach(word => {
            userWordProgress[word.word] = {
                seen: false,
                practiced: false,
                mastered: false,
                difficulty: 'easy',
                attemptCount: 0,
                lastPracticed: null,
                correctPronunciations: 0,
                totalPronunciations: 0
            };
        });
    });
});

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { vocabularyData, progressData, userWordProgress };
}