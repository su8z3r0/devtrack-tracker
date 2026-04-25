import type { TheoryLesson, PracticalActivity } from '../types';

// ========== DOCKER COMPOSE MODULE ==========
const dockerLessons: TheoryLesson[] = [
  {
    id: 'docker-1',
    title: { it: 'Introduzione a Docker', en: 'Docker Introduction' },
    content: {
      it: 'Docker e una piattaforma open-source che permette di automatizzare il deployment di applicazioni all\'interno di container software. I container sono ambienti isolati che includono tutto il necessario per eseguire un\'applicazione: codice, runtime, librerie di sistema, strumenti e configurazioni.\n\n' +
          '**Vantaggi dei Container:**\n' +
          '- **Isolamento**: Ogni container e indipendente e non interferisce con altri\n' +
          '- **Portabilita**: Il container funziona ovunque (dev, staging, produzione)\n' +
          '- **Efficienza**: Condividono il kernel del sistema operativo host\n' +
          '- **Scalabilita**: Facile replicare e scalare orizzontalmente\n\n' +
          '**Container vs VM:**\n' +
          'A differenza delle macchine virtuali, i container non includono un sistema operativo completo ma condividono il kernel dell\'host. Questo li rende piu leggeri e veloci da avviare (secondi anziche minuti).',
      en: 'Docker is an open-source platform that automates the deployment of applications inside software containers. Containers are isolated environments that include everything needed to run an application: code, runtime, system libraries, tools, and configurations.\n\n' +
          '**Container Benefits:**\n' +
          '- **Isolation**: Each container is independent and doesn\'t interfere with others\n' +
          '- **Portability**: The container works anywhere (dev, staging, production)\n' +
          '- **Efficiency**: They share the host OS kernel\n' +
          '- **Scalability**: Easy to replicate and scale horizontally\n\n' +
          '**Containers vs VMs:**\n' +
          'Unlike virtual machines, containers don\'t include a complete operating system but share the host\'s kernel. This makes them lighter and faster to start (seconds instead of minutes).'
    },
    keyPoints: {
      it: [
        'I container isolano applicazioni e dipendenze',
        'Docker condivide il kernel OS, rendendo i container leggeri',
        'Dockerfile definisce come costruire un container',
        'Le immagini sono template read-only per i container',
        'I volumi persistono dati oltre la vita del container'
      ],
      en: [
        'Containers isolate applications and dependencies',
        'Docker shares the OS kernel, making containers lightweight',
        'Dockerfile defines how to build a container',
        'Images are read-only templates for containers',
        'Volumes persist data beyond container lifetime'
      ]
    },
    codeExamples: [
      {
        language: 'dockerfile',
        code: '# Dockerfile - Istruzioni principali\n' +
              'FROM php:8.3-fpm\n\n' +
              '# Installa dipendenze\n' +
              'RUN apt-get update && apt-get install -y \\\n' +
              '    git curl libpng-dev libonig-dev libxml2-dev zip unzip\n\n' +
              '# Installa estensioni PHP\n' +
              'RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd\n\n' +
              '# Working directory\n' +
              'WORKDIR /var/www\n\n' +
              '# Copia file applicazione\n' +
              'COPY . .\n\n' +
              '# Comando di avvio\n' +
              'CMD ["php-fpm"]',
        explanation: 'Esempio di Dockerfile per applicazione PHP'
      },
      {
        language: 'bash',
        code: '# Comandi Docker essenziali\n' +
              'docker build -t myapp:1.0 .        # Costruisce immagine\n' +
              'docker run -d -p 8000:80 myapp:1.0  # Avvia container\n' +
              'docker ps                           # Lista container attivi\n' +
              'docker logs container_name          # Visualizza log\n' +
              'docker exec -it container bash      # Accedi al container',
        explanation: 'Comandi base per gestire container Docker'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'docker-2',
    title: { it: 'Docker Compose: Orchestrazione Multi-Container', en: 'Docker Compose: Multi-Container Orchestration' },
    content: {
      it: 'Docker Compose e uno strumento per definire e gestire applicazioni multi-container. Con un singolo file YAML, configuri tutti i servizi necessari: database, cache, web server, worker.\n\n' +
          '**Struttura di docker-compose.yml:**\n' +
          '- **services**: Definisce i container da creare\n' +
          '- **volumes**: Persistenza dati tra riavvii\n' +
          '- **networks**: Comunicazione tra container\n' +
          '- **depends_on**: Ordine di avvio dei servizi\n\n' +
          '**Rete Interna:**\n' +
          'I container nello stesso servizio possono comunicare usando il nome del servizio come hostname. Compose crea automaticamente una rete bridge per i tuoi container.',
      en: 'Docker Compose is a tool for defining and running multi-container applications. With a single YAML file, you configure all needed services: database, cache, web server, worker.\n\n' +
          '**docker-compose.yml Structure:**\n' +
          '- **services**: Defines containers to create\n' +
          '- **volumes**: Data persistence across restarts\n' +
          '- **networks**: Communication between containers\n' +
          '- **depends_on**: Service startup order\n\n' +
          '**Internal Network:**\n' +
          'Containers in the same service can communicate using the service name as hostname. Compose automatically creates a bridge network for your containers.'
    },
    keyPoints: {
      it: [
        'docker-compose.yml definisce l\'intera infrastruttura',
        'I servizi comunicano usando i nomi come hostname',
        'I volumi mantengono i dati persistenti',
        'depends_on controlla solo l\'ordine di avvio, non la readiness',
        'Le variabili d\'ambiente si configurano con environment'
      ],
      en: [
        'docker-compose.yml defines the entire infrastructure',
        'Services communicate using names as hostnames',
        'Volumes keep data persistent',
        'depends_on only controls startup order, not readiness',
        'Environment variables configured with environment'
      ]
    },
    codeExamples: [
      {
        language: 'yaml',
        code: '# docker-compose.yml - Esempio applicazione PHP\n' +
              'services:\n' +
              '  app:\n' +
              '    build: ./docker/php\n' +
              '    volumes:\n' +
              '      - ./:/var/www\n' +
              '    networks:\n' +
              '      - app-network\n' +
              '    depends_on:\n' +
              '      - db\n' +
              '      - redis\n\n' +
              '  web:\n' +
              '    image: nginx:alpine\n' +
              '    ports:\n' +
              '      - "8000:80"\n' +
              '    volumes:\n' +
              '      - ./:/var/www\n' +
              '      - ./docker/nginx:/etc/nginx/conf.d\n' +
              '    networks:\n' +
              '      - app-network\n\n' +
              '  db:\n' +
              '    image: mysql:8.0\n' +
              '    environment:\n' +
              '      MYSQL_ROOT_PASSWORD: secret\n' +
              '      MYSQL_DATABASE: myapp\n' +
              '    volumes:\n' +
              '      - db_data:/var/lib/mysql\n' +
              '    networks:\n' +
              '      - app-network\n\n' +
              '  redis:\n' +
              '    image: redis:alpine\n' +
              '    networks:\n' +
              '      - app-network\n\n' +
              'networks:\n' +
              '  app-network:\n' +
              '    driver: bridge\n\n' +
              'volumes:\n' +
              '  db_data:',
        explanation: 'Configurazione completa con PHP, Nginx, MySQL e Redis'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'docker-3',
    title: { it: 'Volumi, Reti e Persistenza', en: 'Volumes, Networks and Persistence' },
    content: {
      it: 'I dati nei container sono effimeri di default. Quando un container viene rimosso, anche i suoi dati scompaiono. I volumi risolvono questo problema.\n\n' +
          '**Tipi di Storage:**\n' +
          '- **Bind Mounts**: Montano una directory dell\'host nel container\n' +
          '- **Named Volumes**: Gestiti da Docker, persistono anche se rimuovi il container\n' +
          '- **tmpfs**: Storage in memoria, volatile\n\n' +
          '**Reti Docker:**\n' +
          '- **bridge**: Rete privata interna (default)\n' +
          '- **host**: Condivide la rete dell\'host\n' +
          '- **overlay**: Per container su host multipli (Swarm)\n' +
          '- **none**: Nessuna rete\n\n' +
          '**Best Practices:**\n' +
          '- Usa named volumes per i dati del database\n' +
          '- Separare i log in volumi dedicati\n' +
          '- Configurare healthcheck per i servizi critici',
      en: 'Data in containers is ephemeral by default. When a container is removed, its data disappears too. Volumes solve this problem.\n\n' +
          '**Storage Types:**\n' +
          '- **Bind Mounts**: Mount a host directory into the container\n' +
          '- **Named Volumes**: Managed by Docker, persist even if container removed\n' +
          '- **tmpfs**: In-memory storage, volatile\n\n' +
          '**Docker Networks:**\n' +
          '- **bridge**: Private internal network (default)\n' +
          '- **host**: Shares host\'s network\n' +
          '- **overlay**: For containers on multiple hosts (Swarm)\n' +
          '- **none**: No network\n\n' +
          '**Best Practices:**\n' +
          '- Use named volumes for database data\n' +
          '- Separate logs into dedicated volumes\n' +
          '- Configure healthcheck for critical services'
    },
    keyPoints: {
      it: [
        'I volumi named persistono indipendentemente dal container',
        'Bind mounts sono ideali per lo sviluppo (live reload)',
        'Ogni servizio si connette al DNS del servizio target',
        'Healthcheck garantisce che i servizi siano pronti',
        'Evita di salvare dati nel filesystem del container'
      ],
      en: [
        'Named volumes persist independently of containers',
        'Bind mounts are ideal for development (live reload)',
        'Each service connects to target service DNS',
        'Healthcheck ensures services are ready',
        'Avoid saving data to container filesystem'
      ]
    },
    codeExamples: [
      {
        language: 'yaml',
        code: 'services:\n' +
              '  db:\n' +
              '    image: mysql:8.0\n' +
              '    volumes:\n' +
              '      # Named volume per dati persistenti\n' +
              '      - db_data:/var/lib/mysql\n' +
              '      # Bind mount per script di init\n' +
              '      - ./init.sql:/docker-entrypoint-initdb.d/init.sql\n' +
              '    environment:\n' +
              '      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}\n' +
              '    healthcheck:\n' +
              '      test: ["CMD", "mysqladmin", "ping"]\n' +
              '      interval: 10s\n' +
              '      timeout: 5s\n' +
              '      retries: 5\n' +
              '    networks:\n' +
              '      - backend\n\n' +
              '  app:\n' +
              '    build: .\n' +
              '    depends_on:\n' +
              '      db:\n' +
              '        condition: service_healthy\n' +
              '    environment:\n' +
              '      DB_HOST: db  # Nome del servizio = hostname DNS\n' +
              '      DB_NAME: myapp\n' +
              '    networks:\n' +
              '      - backend\n' +
              '      - frontend\n\n' +
              'networks:\n' +
              '  backend:\n' +
              '    internal: true  # Non esposta all\'esterno\n' +
              '  frontend:\n' +
              '    driver: bridge\n\n' +
              'volumes:\n' +
              '  db_data:\n' +
              '    driver: local',
        explanation: 'Volumi persistenti, healthcheck e reti isolate'
      }
    ],
    estimatedMinutes: 15
  }
];

const dockerActivities: PracticalActivity[] = [
  {
    id: 'docker-activity-1',
    title: { it: 'Containerizza un\'Applicazione PHP', en: 'Containerize a PHP Application' },
    description: {
      it: 'Crea un ambiente Docker completo per un\'applicazione PHP con MySQL. Devi configurare PHP-FPM, Nginx e MySQL per lavorare insieme.',
      en: 'Create a complete Docker environment for a PHP application with MySQL. You need to configure PHP-FPM, Nginx and MySQL to work together.'
    },
    tasks: {
      it: [
        'Crea un Dockerfile per PHP 8.3 con estensioni comuni',
        'Configura Nginx per servire PHP tramite FastCGI',
        'Imposta docker-compose.yml con 3 servizi: app, web, db',
        'Crea un file index.php che mostra phpinfo()',
        'Verifica che l\'applicazione risponda su localhost:8000'
      ],
      en: [
        'Create a Dockerfile for PHP 8.3 with common extensions',
        'Configure Nginx to serve PHP via FastCGI',
        'Set up docker-compose.yml with 3 services: app, web, db',
        'Create an index.php showing phpinfo()',
        'Verify the application responds on localhost:8000'
      ]
    },
    successCriteria: {
      it: [
        'Il container PHP si avvia senza errori',
        'Nginx serve correttamente i file PHP',
        'MySQL e accessibile dall\'applicazione',
        'I dati del database persistono tra riavvii',
        'Visita http://localhost:8000 mostra phpinfo()'
      ],
      en: [
        'PHP container starts without errors',
        'Nginx correctly serves PHP files',
        'MySQL is accessible from the application',
        'Database data persists between restarts',
        'Visiting http://localhost:8000 shows phpinfo()'
      ]
    },
    hints: {
      it: [
        'Usa FROM php:8.3-fpm-alpine come base',
        'La direttiva fastcgi_pass in Nginx deve puntare a php-fpm:9000',
        'Il nome del servizio diventa hostname DNS (es. db, app)',
        'Aggiungi HEALTHCHECK nel Dockerfile di produzione'
      ],
      en: [
        'Use FROM php:8.3-fpm-alpine as base',
        'The fastcgi_pass directive in Nginx must point to php-fpm:9000',
        'Service name becomes DNS hostname (e.g. db, app)',
        'Add HEALTHCHECK in production Dockerfile'
      ]
    },
    terminalUrl: 'ws://localhost:3001',
    estimatedMinutes: 45
  },
  {
    id: 'docker-activity-2',
    title: { it: 'Multi-Stage Build e Ottimizzazione', en: 'Multi-Stage Build and Optimization' },
    description: {
      it: 'Ottimizza il tuo Dockerfile usando multi-stage build per separare le dipendenze di build da quelle di runtime, riducendo la dimensione finale dell\'immagine.',
      en: 'Optimize your Dockerfile using multi-stage build to separate build dependencies from runtime ones, reducing the final image size.'
    },
    tasks: {
      it: [
        'Riscrivi il Dockerfile usando multi-stage build',
        'Copia solo i file necessari dal builder stage',
        'Aggiungi un layer di cache per Composer',
        'Configura PHP opcache per produzione',
        'Confronta la dimensione delle immagini prima/dopo'
      ],
      en: [
        'Rewrite the Dockerfile using multi-stage build',
        'Copy only necessary files from builder stage',
        'Add a cache layer for Composer',
        'Configure PHP opcache for production',
        'Compare image sizes before/after'
      ]
    },
    successCriteria: {
      it: [
        'L\'immagine finale e significativamente piu piccola',
        'Non ci sono tool di build (git, curl) nell\'immagine finale',
        'Le dipendenze Composer sono installate correttamente',
        'L\'applicazione funziona normalmente',
        'Riduzione minimo 50% della dimensione'
      ],
      en: [
        'Final image is significantly smaller',
        'No build tools (git, curl) in final image',
        'Composer dependencies installed correctly',
        'Application works normally',
        'Minimum 50% size reduction'
      ]
    },
    hints: {
      it: [
        'Usa AS builder per il primo stage',
        'COPY --from=builder copia file tra stage',
        'Usa composer install --no-dev --optimize-autoloader',
        'Considera php:8.3-fpm-alpine come base finale'
      ],
      en: [
        'Use AS builder for the first stage',
        'COPY --from=builder copies files between stages',
        'Use composer install --no-dev --optimize-autoloader',
        'Consider php:8.3-fpm-alpine as final base'
      ]
    },
    terminalUrl: 'ws://localhost:3001',
    estimatedMinutes: 30
  }
];

// ========== PHPUNIT TDD MODULE ==========
const phpunitLessons: TheoryLesson[] = [
  {
    id: 'phpunit-1',
    title: { it: 'TDD: Test-Driven Development', en: 'TDD: Test-Driven Development' },
    content: {
      it: 'TDD e una metodologia di sviluppo dove scrivi i test PRIMA del codice di produzione. Il ciclo e: Rosso -> Verde -> Refactor.\n\n' +
          '**Il Ciclo TDD:**\n' +
          '1. **Rosso**: Scrivi un test che fallisce\n' +
          '2. **Verde**: Scrivi il codice minimo per far passare il test\n' +
          '3. **Refactor**: Migliora il codice mantenendo i test verdi\n\n' +
          '**Vantaggi:**\n' +
          '- Codice piu affidabile e manutenibile\n' +
          '- Design migliore perche pensi all\'uso prima\n' +
          '- Documentazione vivente nei test\n' +
          '- Confidenza nel refactoring',
      en: 'TDD is a development methodology where you write tests BEFORE production code. The cycle is: Red -> Green -> Refactor.\n\n' +
          '**The TDD Cycle:**\n' +
          '1. **Red**: Write a failing test\n' +
          '2. **Green**: Write minimal code to pass the test\n' +
          '3. **Refactor**: Improve code while keeping tests green\n\n' +
          '**Benefits:**\n' +
          '- More reliable and maintainable code\n' +
          '- Better design because you think about usage first\n' +
          '- Living documentation in tests\n' +
          '- Confidence in refactoring'
    },
    keyPoints: {
      it: [
        'Scrivere test prima del codice',
        'Ciclo Rosso-Verde-Refactor',
        'Un solo concetto per test',
        'AAA: Arrange, Act, Assert'
      ],
      en: [
        'Write tests before code',
        'Red-Green-Refactor cycle',
        'One concept per test',
        'AAA: Arrange, Act, Assert'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: '<?php\n' +
              'use PHPUnit\\Framework\\TestCase;\n\n' +
              'class CalculatorTest extends TestCase\n' +
              '{\n' +
              '    public function test_addition()\n' +
              '    {\n' +
              '        // Arrange\n' +
              '        $calc = new Calculator();\n' +
              '        // Act\n' +
              '        $result = $calc->add(2, 3);\n' +
              '        // Assert\n' +
              '        $this->assertEquals(5, $result);\n' +
              '    }\n' +
              '}',
        explanation: 'Struttura AAA di un test PHPUnit'
      },
      {
        language: 'php',
        code: '<?php\n' +
              'class Calculator\n' +
              '{\n' +
              '    public function add(int $a, int $b): int\n' +
              '    {\n' +
              '        return $a + $b;\n' +
              '    }\n' +
              '}',
        explanation: 'Implementazione dopo i test'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'phpunit-2',
    title: { it: 'PHPUnit: Setup e Assertions', en: 'PHPUnit: Setup and Assertions' },
    content: {
      it: 'PHPUnit e il framework di test standard per PHP. Configurarlo correttamente e fondamentale.\n\n' +
          '**Installation:**\n' +
          'composer require --dev phpunit/phpunit\n\n' +
          '**phpunit.xml:**\n' +
          'Il file di configurazione definisce dove cercare i test, il bootstrap, e le impostazioni di coverage.\n\n' +
          '**Assertions comuni:**\n' +
          '- assertEquals() - uguaglianza\n' +
          '- assertTrue()/assertFalse() - booleani\n' +
          '- assertNull()/assertNotNull() - null check\n' +
          '- assertInstanceOf() - tipo\n' +
          '- expectException() - eccezioni\n\n' +
          '**Data Providers:**\n' +
          'Permettono di eseguire lo stesso test con diversi input, riducendo la duplicazione del codice.',
      en: 'PHPUnit is the standard testing framework for PHP. Proper configuration is essential.\n\n' +
          '**Installation:**\n' +
          'composer require --dev phpunit/phpunit\n\n' +
          '**phpunit.xml:**\n' +
          'The configuration file defines where to find tests, bootstrap, and coverage settings.\n\n' +
          '**Common assertions:**\n' +
          '- assertEquals() - equality\n' +
          '- assertTrue()/assertFalse() - booleans\n' +
          '- assertNull()/assertNotNull() - null check\n' +
          '- assertInstanceOf() - type\n' +
          '- expectException() - exceptions\n\n' +
          '**Data Providers:**\n' +
          'Allow running the same test with different inputs, reducing code duplication.'
    },
    keyPoints: {
      it: [
        'assertEquals per confronto',
        'expectException per eccezioni',
        'setUp per stato condiviso',
        'DataProvider per multipli input'
      ],
      en: [
        'assertEquals for comparison',
        'expectException for exceptions',
        'setUp for shared state',
        'DataProvider for multiple inputs'
      ]
    },
    codeExamples: [
      {
        language: 'xml',
        code: '<?xml version="1.0"?>\n' +
              '<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
              '         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/10.0/phpunit.xsd"\n' +
              '         bootstrap="vendor/autoload.php"\n' +
              '         colors="true"\n' +
              '         cacheDirectory=".phpunit.cache">\n' +
              '    <testsuites>\n' +
              '        <testsuite name="Unit">\n' +
              '            <directory>tests/Unit</directory>\n' +
              '        </testsuite>\n' +
              '    </testsuites>\n' +
              '    <coverage>\n' +
              '        <report>\n' +
              '            <clover outputFile="coverage.xml"/>\n' +
              '        </report>\n' +
              '    </coverage>\n' +
              '</phpunit>',
        explanation: 'Configurazione phpunit.xml standard'
      },
      {
        language: 'php',
        code: 'public function test_division_by_zero()\n' +
              '{\n' +
              '    $this->expectException(DivisionByZeroException::class);\n' +
              '    $calc = new Calculator();\n' +
              '    $calc->divide(10, 0);\n' +
              '}\n\n' +
              '/**\n' +
              ' * @dataProvider additionProvider\n' +
              ' */\n' +
              'public function test_additions(int $a, int $b, int $expected)\n' +
              '{\n' +
              '    $calc = new Calculator();\n' +
              '    $this->assertEquals($expected, $calc->add($a, $b));\n' +
              '}\n\n' +
              'public static function additionProvider(): array\n' +
              '{\n' +
              '    return [\n' +
              '        [2, 3, 5],\n' +
              '        [0, 0, 0],\n' +
              '        [-1, 1, 0],\n' +
              '    ];\n' +
              '}',
        explanation: 'Eccezioni e Data Providers'
      }
    ],
    estimatedMinutes: 20
  }
];

const phpunitActivities: PracticalActivity[] = [
  {
    id: 'phpunit-activity-1',
    title: { it: 'TDD Calculator', en: 'TDD Calculator' },
    description: {
      it: 'Implementa una classe Calculator usando TDD completo con test per ogni operazione.',
      en: 'Implement a Calculator class using full TDD with tests for every operation.'
    },
    tasks: {
      it: [
        'Scrivi test per add, subtract, multiply, divide',
        'Implementa metodi uno alla volta (Rosso -> Verde)',
        'Aggiungi test per divisione per zero',
        'Refactor con DataProvider per operazioni',
        'Raggiungi 100% code coverage'
      ],
      en: [
        'Write tests for add, subtract, multiply, divide',
        'Implement methods one at a time (Red -> Green)',
        'Add test for division by zero',
        'Refactor with DataProvider for operations',
        'Reach 100% code coverage'
      ]
    },
    successCriteria: {
      it: [
        'Tutti i test passano (verde)',
        'Coverage al 100% su Calculator',
        'Nessun codice senza test corrispondente',
        'DataProvider per test parametrizzati',
        'Eccezione gestita per divisione per zero'
      ],
      en: [
        'All tests pass (green)',
        '100% coverage on Calculator',
        'No code without corresponding test',
        'DataProvider for parameterized tests',
        'Exception handled for division by zero'
      ]
    },
    hints: {
      it: [
        'Inizia sempre dal test che fallisce',
        'Scrivi solo il codice minimo necessario',
        'Usa setUp per istanziare Calculator'
      ],
      en: [
        'Always start with a failing test',
        'Write only the minimum necessary code',
        'Use setUp to instantiate Calculator'
      ]
    },
    estimatedMinutes: 60
  }
];

// ========== GITHUB ACTIONS MODULE ==========
const githubActionsLessons: TheoryLesson[] = [
  {
    id: 'github-actions-1',
    title: { it: 'Introduzione a GitHub Actions', en: 'GitHub Actions Introduction' },
    content: {
      it: 'GitHub Actions automatizza workflow di build, test e deployment direttamente su GitHub.\n\n' +
          '**Concetti chiave:**\n' +
          '- **Workflow**: Processo automatizzato configurato in YAML\n' +
          '- **Jobs**: Unità di lavoro che eseguono passi (steps)\n' +
          '- **Steps**: Comandi o azioni individuali\n' +
          '- **Runners**: Macchine virtuali che eseguono i job\n\n' +
          '**Trigger:**\n' +
          '- push, pull_request, schedule (cron)\n' +
          '- workflow_dispatch (manuale)\n' +
          '- release, issue, etc.\n\n' +
          'Macchine virtuali che eseguono i job. GitHub fornisce runner Ubuntu, Windows, macOS gratuiti.',
      en: 'GitHub Actions automates build, test and deployment workflows directly on GitHub.\n\n' +
          '**Key Concepts:**\n' +
          '- **Workflow**: Automated process configured in YAML\n' +
          '- **Jobs**: Work units that execute steps\n' +
          '- **Steps**: Individual commands or actions\n' +
          '- **Runners**: Virtual machines that execute jobs\n\n' +
          '**Triggers:**\n' +
          '- push, pull_request, schedule (cron)\n' +
          '- workflow_dispatch (manual)\n' +
          '- release, issue, etc.\n\n' +
          'Virtual machines that execute jobs. GitHub provides free Ubuntu, Windows, macOS runners.'
    },
    keyPoints: {
      it: [
        'Workflow in .github/workflows/',
        'Jobs eseguiti in parallelo di default',
        'needs per dipendenze tra job',
        'actions/checkout per clonare repo',
        'secrets per variabili sensibili'
      ],
      en: [
        'Workflows in .github/workflows/',
        'Jobs run in parallel by default',
        'needs for job dependencies',
        'actions/checkout to clone repo',
        'secrets for sensitive variables'
      ]
    },
    codeExamples: [
      {
        language: 'yaml',
        code: 'name: CI\n\n' +
              'on:\n' +
              '  push:\n' +
              '    branches: [main, develop]\n' +
              '  pull_request:\n' +
              '    branches: [main]\n\n' +
              'jobs:\n' +
              '  test:\n' +
              '    runs-on: ubuntu-latest\n' +
              '    steps:\n' +
              '      - uses: actions/checkout@v4\n' +
              '      - uses: shivammathur/setup-php@v2\n' +
              '        with:\n' +
              '          php-version: \'8.3\'\n' +
              '      - name: Install dependencies\n' +
              '        run: composer install --no-interaction\n' +
              '      - name: Run tests\n' +
              '        run: ./vendor/bin/phpunit',
        explanation: 'Workflow CI base per PHP'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'github-actions-2',
    title: { it: 'Matrix Build e Artifacts', en: 'Matrix Build and Artifacts' },
    content: {
      it: 'Testare su multiple versioni di PHP e OS e essenziale per librerie open-source.\n\n' +
          '**Matrix Strategy:**\n' +
          '- Esegue job con combinazioni di variabili\n' +
          '- Fail-fast: se un job fallisce, interrompe gli altri\n' +
          '- include/exclude per combinazioni specifiche\n\n' +
          '**Artifacts:**\n' +
          'File generati durante il workflow (coverage reports, build) possono essere salvati e scaricati.\n\n' +
          '**Caching:**\n' +
          '- actions/cache per dipendenze (Composer, npm)\n' +
          '- Riduce drasticamente i tempi di build',
      en: 'Testing on multiple PHP versions and OS is essential for open-source libraries.\n\n' +
          '**Matrix Strategy:**\n' +
          '- Runs jobs with combinations of variables\n' +
          '- Fail-fast: if one job fails, stops others\n' +
          '- include/exclude for specific combinations\n\n' +
          '**Artifacts:**\n' +
          'Files generated during the workflow (coverage reports, build) can be saved and downloaded.\n\n' +
          '**Caching:**\n' +
          '- actions/cache for dependencies (Composer, npm)\n' +
          '- Dramatically reduces build times'
    },
    keyPoints: {
      it: [
        'matrix.php per versioni multiple',
        'fail-fast: true per interrompere subito',
        'upload-artifact per coverage',
        'cache per composer e npm',
        'services per database di test'
      ],
      en: [
        'matrix.php for multiple versions',
        'fail-fast: true to stop quickly',
        'upload-artifact for coverage',
        'cache for composer and npm',
        'services for test databases'
      ]
    },
    codeExamples: [
      {
        language: 'yaml',
        code: 'jobs:\n' +
              '  test:\n' +
              '    runs-on: ${{ matrix.os }}\n' +
              '    strategy:\n' +
              '      fail-fast: true\n' +
              '      matrix:\n' +
              '        os: [ubuntu-latest, windows-latest]\n' +
              '        php: [\'8.2\', \'8.3\']\n' +
              '    steps:\n' +
              '      - uses: actions/checkout@v4\n' +
              '      - uses: shivammathur/setup-php@v2\n' +
              '        with:\n' +
              '          php-version: ${{ matrix.php }}\n' +
              '      - uses: actions/cache@v3\n' +
              '        with:\n' +
              '          path: vendor\n' +
              '          key: ${{ runner.os }}-php-${{ matrix.php }}\n' +
              '      - run: composer install\n' +
              '      - run: vendor/bin/phpunit\n' +
              '      - uses: actions/upload-artifact@v3\n' +
              '        with:\n' +
              '          name: coverage-${{ matrix.php }}\n' +
              '          path: coverage.xml',
        explanation: 'Matrix build con cache e artifacts'
      }
    ],
    estimatedMinutes: 15
  }
];

const githubActionsActivities: PracticalActivity[] = [
  {
    id: 'github-actions-activity-1',
    title: { it: 'Pipeline CI/CD Completa', en: 'Complete CI/CD Pipeline' },
    description: {
      it: 'Configura una pipeline GitHub Actions completa per un progetto Laravel: test, code quality e deploy staging.',
      en: 'Configure a complete GitHub Actions pipeline for a Laravel project: test, code quality and staging deploy.'
    },
    tasks: {
      it: [
        'Crea workflow per test su PHP 8.2 e 8.3',
        'Aggiungi job per PHP CS Fixer',
        'Configura test con database SQLite in-memory',
        'Aggiungi step per analisi statica (PHPStan)',
        'Deploy automatico su server staging'
      ],
      en: [
        'Create workflow for tests on PHP 8.2 and 8.3',
        'Add job for PHP CS Fixer',
        'Configure tests with in-memory SQLite database',
        'Add step for static analysis (PHPStan)',
        'Automatic deploy to staging server'
      ]
    },
    successCriteria: {
      it: [
        'Tutti i job passano su PR',
        'Code style verificato automaticamente',
        'Coverage mostrato nei commenti PR',
        'Deploy su staging dopo merge su develop',
        'Pipeline completa in < 5 minuti'
      ],
      en: [
        'All jobs pass on PR',
        'Code style checked automatically',
        'Coverage shown in PR comments',
        'Deploy to staging after merge to develop',
        'Complete pipeline in < 5 minutes'
      ]
    },
    hints: {
      it: [
        'Usa services: mysql per test con database reale',
        'Aggiungi secrets.SSH_KEY per deploy',
        'Considera laravel-test-sync-action'
      ],
      en: [
        'Use services: mysql for tests with real database',
        'Add secrets.SSH_KEY for deploy',
        'Consider laravel-test-sync-action'
      ]
    },
    estimatedMinutes: 90
  }
];

// ========== LIVEWIRE 3 MODULE ==========
const livewireLessons: TheoryLesson[] = [
  {
    id: 'livewire-1',
    title: { it: 'Introduzione a Livewire', en: 'Livewire Introduction' },
    content: {
      it: 'Livewire e un framework full-stack per Laravel che permette di costruire interfacce dinamiche senza scrivere JavaScript.\n\n' +
          '**Concetti chiave:**\n' +
          '- Componenti PHP che gestiscono stato e logica\n' +
          '- View Blade per il rendering\n' +
          '- Proprieta pubbliche per lo stato reattivo\n' +
          '- Azioni per gestire eventi utente\n\n' +
          'Ogni componente e una classe PHP che estende Component, con un metodo render() che restituisce una view Blade.',
      en: 'Livewire is a full-stack Laravel framework for building dynamic interfaces without writing JavaScript.\n\n' +
          '**Key Concepts:**\n' +
          '- PHP components that manage state and logic\n' +
          '- Blade views for rendering\n' +
          '- Public properties for reactive state\n' +
          '- Actions to handle user events\n\n' +
          'Each component is a PHP class extending Component, with a render() method returning a Blade view.'
    },
    keyPoints: {
      it: ['Componenti PHP + Blade', 'Proprieta pubbliche reattive', 'Azioni per eventi', 'Nessun JavaScript richiesto'],
      en: ['PHP + Blade components', 'Reactive public properties', 'Actions for events', 'No JavaScript required']
    },
    codeExamples: [
      {
        language: 'php',
        code: '<?php\n' +
              'namespace App\\Livewire;\n' +
              'use Livewire\\Component;\n\n' +
              'class Counter extends Component\n' +
              '{\n' +
              '    public int $count = 0;\n\n' +
              '    public function increment()\n' +
              '    {\n' +
              '        $this->count++;\n' +
              '    }\n\n' +
              '    public function render()\n' +
              '    {\n' +
              '        return view(\'livewire.counter\');\n' +
              '    }\n' +
              '}',
        explanation: 'Componente contatore con stato reattivo'
      },
      {
        language: 'html',
        code: '<div>\n' +
              '    <h1>{{ $count }}</h1>\n' +
              '    <button wire:click="increment">+</button>\n' +
              '</div>',
        explanation: 'View Blade con wire:click'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'livewire-2',
    title: { it: 'Forms e Validazione', en: 'Forms and Validation' },
    content: {
      it: 'Livewire gestisce form complessi con validazione in tempo reale.\n\n' +
          '**Feature principali:**\n' +
          '- wire:model per il two-way binding\n' +
          '- Validazione inline con messaggi\n' +
          '- File uploads con gestione temporanea\n' +
          '- Paginazione integrata\n\n' +
          'Le proprieta pubbliche sono automaticamente sincronizzate con il frontend.',
      en: 'Livewire handles complex forms with real-time validation.\n\n' +
          '**Main Features:**\n' +
          '- wire:model for two-way binding\n' +
          '- Inline validation with messages\n' +
          '- File uploads with temporary handling\n' +
          '- Built-in pagination\n\n' +
          'Public properties are automatically synchronized with the frontend.'
    },
    keyPoints: {
      it: ['wire:model per binding', 'Validazione automatica', 'File upload nativo', 'Polling per aggiornamenti'],
      en: ['wire:model for binding', 'Automatic validation', 'Native file upload', 'Polling for updates']
    },
    codeExamples: [
      {
        language: 'php',
        code: 'public string $email = \'\';\n' +
              'public string $password = \'\';\n\n' +
              'protected array $rules = [\n' +
              '    \'email\' => \'required|email\',\n' +
              '    \'password\' => \'required|min:8\',\n' +
              '];\n\n' +
              'public function submit()\n' +
              '{\n' +
              '    $this->validate();\n' +
              '    // Logica dopo validazione\n' +
              '}',
        explanation: 'Form con validazione Livewire'
      },
      {
        language: 'html',
        code: '<form wire:submit.prevent="submit">\n' +
              '    <input wire:model="email" type="email">\n' +
              '    @error(\'email\') <span>{{ $message }}</span> @enderror\n\n' +
              '    <input wire:model="password" type="password">\n' +
              '    <button type="submit">Invia</button>\n' +
              '</form>',
        explanation: 'Template form con errori'
      }
    ],
    estimatedMinutes: 15
  }
];

const livewireActivities: PracticalActivity[] = [
  {
    id: 'livewire-activity-1',
    title: { it: 'Todo List Interattiva', en: 'Interactive Todo List' },
    description: {
      it: 'Costruisci una todo list completa con Livewire: aggiunta, completamento e eliminazione task.',
      en: 'Build a complete todo list with Livewire: add, complete and delete tasks.'
    },
    tasks: {
      it: [
        'Crea il componente TodoList con proprieta tasks',
        'Implementa metodo addTask() con validazione',
        'Aggiungi toggle per completamento',
        'Implementa eliminazione con conferma',
        'Mostra contatore task attive/completate'
      ],
      en: [
        'Create TodoList component with tasks property',
        'Implement addTask() with validation',
        'Add toggle for completion',
        'Implement deletion with confirmation',
        'Show counter for active/completed tasks'
      ]
    },
    successCriteria: {
      it: [
        'Aggiunta task in tempo reale',
        'Validazione campo vuoto',
        'Stato completato aggiornato istantaneamente',
        'Persistenza in sessione o database',
        'Contatore aggiornato automaticamente'
      ],
      en: [
        'Real-time task addition',
        'Empty field validation',
        'Completed state updated instantly',
        'Persistence in session or database',
        'Counter updated automatically'
      ]
    },
    hints: {
      it: [
        'Usa wire:model.defer per input',
        'Considera una collection per i task',
        'Aggiungi wire:loading per stati'
      ],
      en: [
        'Use wire:model.defer for input',
        'Consider a collection for tasks',
        'Add wire:loading for states'
      ]
    },
    estimatedMinutes: 45
  }
];

// ========== TAILWIND CSS MODULE ==========
const tailwindLessons: TheoryLesson[] = [
  {
    id: 'tailwind-1',
    title: { it: 'Utility-First CSS', en: 'Utility-First CSS' },
    content: {
      it: 'Tailwind CSS e un framework utility-first che fornisce classi atomiche per costruire design custom.\n\n' +
          '**Vantaggi:**\n' +
          '- Nessun CSS custom da scrivere\n' +
          '- Design system consistente\n' +
          '- File CSS piccolo in produzione (purge)\n' +
          '- Responsive design mobile-first\n\n' +
          'Ogni classe ha un unico scopo: p-4 per padding, text-center per allineamento, bg-blue-500 per colore.',
      en: 'Tailwind CSS is a utility-first framework providing atomic classes to build custom designs.\n\n' +
          '**Benefits:**\n' +
          '- No custom CSS to write\n' +
          '- Consistent design system\n' +
          '- Small CSS file in production (purge)\n' +
          '- Mobile-first responsive design\n\n' +
          'Each class has a single purpose: p-4 for padding, text-center for alignment, bg-blue-500 for color.'
    },
    keyPoints: {
      it: ['Utility-first: una classe, uno scopo', 'Responsive con prefissi sm/md/lg', 'Dark mode con dark:', 'Componenti con @apply'],
      en: ['Utility-first: one class, one purpose', 'Responsive with sm/md/lg prefixes', 'Dark mode with dark:', 'Components with @apply']
    },
    codeExamples: [
      {
        language: 'html',
        code: '<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n' +
              '    Clicca qui\n' +
              '</button>',
        explanation: 'Bottone stilizzato con utility class'
      },
      {
        language: 'html',
        code: '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\n' +
              '    <div class="p-4 bg-white shadow">Card 1</div>\n' +
              '    <div class="p-4 bg-white shadow">Card 2</div>\n' +
              '    <div class="p-4 bg-white shadow">Card 3</div>\n' +
              '</div>',
        explanation: 'Grid responsive: 1 colonna mobile, 3 desktop'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'tailwind-2',
    title: { it: 'Personalizzazione e Dark Mode', en: 'Customization and Dark Mode' },
    content: {
      it: 'Tailwind si configura tramite tailwind.config.js per temi custom, colori, font e breakpoint.\n\n' +
          '**Configurazione:**\n' +
          '- theme.extend per sovrascrivere valori\n' +
          '- Plugins per aggiungere funzionalita\n' +
          '- Dark mode automatico o manuale\n\n' +
          'La direttiva @apply permette di estrarre utility in classi CSS riutilizzabili.',
      en: 'Tailwind is configured via tailwind.config.js for custom themes, colors, fonts and breakpoints.\n\n' +
          '**Configuration:**\n' +
          '- theme.extend to override values\n' +
          '- Plugins to add functionality\n' +
          '- Dark mode automatic or manual\n\n' +
          'The @apply directive extracts utilities into reusable CSS classes.'
    },
    keyPoints: {
      it: ['tailwind.config.js per temi', '@apply per componenti CSS', 'darkMode: class o media', 'JIT engine per build veloci'],
      en: ['tailwind.config.js for themes', '@apply for CSS components', 'darkMode: class or media', 'JIT engine for fast builds']
    },
    codeExamples: [
      {
        language: 'javascript',
        code: 'module.exports = {\n' +
              '    darkMode: \'class\',\n' +
              '    theme: {\n' +
              '        extend: {\n' +
              '            colors: {\n' +
              '                brand: {\n' +
              '                    500: \'#3b82f6\',\n' +
              '                    700: \'#1d4ed8\',\n' +
              '                },\n' +
              '            },\n' +
              '        },\n' +
              '    },\n' +
              '}',
        explanation: 'Configurazione tema custom con dark mode'
      }
    ],
    estimatedMinutes: 15
  }
];

const tailwindActivities: PracticalActivity[] = [
  {
    id: 'tailwind-activity-1',
    title: { it: 'Dashboard Responsive', en: 'Responsive Dashboard' },
    description: {
      it: 'Costruisci una dashboard admin completamente responsive usando solo classi Tailwind.',
      en: 'Build a fully responsive admin dashboard using only Tailwind classes.'
    },
    tasks: {
      it: [
        'Crea sidebar collapsible per mobile',
        'Implementa header con navbar e search',
        'Aggiungi card statistiche con icone',
        'Costruisci tabella dati responsive',
        'Attiva dark mode toggle'
      ],
      en: [
        'Create collapsible sidebar for mobile',
        'Implement header with navbar and search',
        'Add statistics cards with icons',
        'Build responsive data table',
        'Enable dark mode toggle'
      ]
    },
    successCriteria: {
      it: [
        'Layout responsive su mobile e desktop',
        'Sidebar si chiude su schermi piccoli',
        'Dark mode attivabile con toggle',
        'Nessun CSS custom scritto',
        'File CSS finale < 50KB'
      ],
      en: [
        'Responsive layout on mobile and desktop',
        'Sidebar collapses on small screens',
        'Dark mode toggleable',
        'No custom CSS written',
        'Final CSS file < 50KB'
      ]
    },
    hints: {
      it: [
        'Usa flex e grid per layout',
        'hidden md:block per responsive',
        'dark: per varianti dark mode'
      ],
      en: [
        'Use flex and grid for layout',
        'hidden md:block for responsive',
        'dark: for dark mode variants'
      ]
    },
    estimatedMinutes: 60
  }
];

// ========== VUE.JS 3 MODULE ==========
const vueLessons: TheoryLesson[] = [
  {
    id: 'vue-1',
    title: { it: 'Composition API', en: 'Composition API' },
    content: {
      it: 'Vue 3 introduce la Composition API, un approccio alternativo a Options API per organizzare la logica per feature invece che per opzione.\n\n' +
          '**Core API:**\n' +
          '- ref() per stato primitivo reattivo\n' +
          '- reactive() per oggetti reattivi\n' +
          '- computed() per valori derivati\n' +
          '- watch() per side effects\n' +
          '- <script setup> per sintassi concisa\n\n' +
          'La Composition API migliora la riusabilita con composable functions.',
      en: 'Vue 3 introduces the Composition API, an alternative to Options API for organizing logic by feature instead of by option.\n\n' +
          '**Core API:**\n' +
          '- ref() for reactive primitive state\n' +
          '- reactive() for reactive objects\n' +
          '- computed() for derived values\n' +
          '- watch() for side effects\n' +
          '- <script setup> for concise syntax\n\n' +
          'The Composition API improves reusability with composable functions.'
    },
    keyPoints: {
      it: ['ref() per primitivi', 'reactive() per oggetti', 'computed() per valori derivati', 'watch() per side effects', '<script setup> per sintesi'],
      en: ['ref() for primitives', 'reactive() for objects', 'computed() for derived values', 'watch() for side effects', '<script setup> for conciseness']
    },
    codeExamples: [
      {
        language: 'vue',
        code: '<script setup lang="ts">\n' +
              'import { ref, computed, watch } from \'vue\'\n' +
              'const count = ref(0)\n' +
              'const doubled = computed(() => count.value * 2)\n\n' +
              'watch(count, (newVal, oldVal) => {\n' +
              '    console.log(\'Count changed from \' + oldVal + \' to \' + newVal)\n' +
              '})\n\n' +
              'function increment() {\n' +
              '    count.value++\n' +
              '}\n' +
              '</script>\n' +
              '<template>\n' +
              '    <div>\n' +
              '        <p>Count: {{ count }}</p>\n' +
              '        <p>Doubled: {{ doubled }}</p>\n' +
              '        <button @click="increment">+</button>\n' +
              '    </div>\n' +
              '</template>',
        explanation: 'Composition API con ref, computed e watch'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'vue-2',
    title: { it: 'Vue Router e Pinia', en: 'Vue Router and Pinia' },
    content: {
      it: 'Vue Router gestisce la navigazione lato client, Pinia e lo store ufficiale per stato globale.\n\n' +
          '**Vue Router:**\n' +
          '- Route params e query\n' +
          '- Navigation guards\n' +
          '- Lazy loading componenti\n\n' +
          '**Pinia:**\n' +
          '- Store con state, getters, actions\n' +
          '- Composable con setup stores\n' +
          '- Devtools integration\n\n' +
          'Entrambi sono progettati per TypeScript.',
      en: 'Vue Router handles client-side navigation, Pinia is the official store for global state.\n\n' +
          '**Vue Router:**\n' +
          '- Route params and query\n' +
          '- Navigation guards\n' +
          '- Lazy loading components\n\n' +
          '**Pinia:**\n' +
          '- Store with state, getters, actions\n' +
          '- Composable with setup stores\n' +
          '- Devtools integration\n\n' +
          'Both are designed for TypeScript.'
    },
    keyPoints: {
      it: ['useRoute() per parametri', 'useRouter() per navigazione', 'defineStore() per Pinia', 'Actions asincrone in store'],
      en: ['useRoute() for params', 'useRouter() for navigation', 'defineStore() for Pinia', 'Async actions in store']
    },
    codeExamples: [
      {
        language: 'typescript',
        code: 'import { defineStore } from \'pinia\'\n' +
              'import { ref, computed } from \'vue\'\n\n' +
              'export const useUserStore = defineStore(\'user\', () => {\n' +
              '    const name = ref(\'\')\n' +
              '    const isLoggedIn = computed(() => !!name.value)\n\n' +
              '    function login(newName: string) {\n' +
              '        name.value = newName\n' +
              '    }\n\n' +
              '    return { name, isLoggedIn, login }\n' +
              '})',
        explanation: 'Setup store Pinia con Composition API'
      }
    ],
    estimatedMinutes: 20
  }
];

const vueActivities: PracticalActivity[] = [
  {
    id: 'vue-activity-1',
    title: { it: 'App Note con Vue 3', en: 'Notes App with Vue 3' },
    description: {
      it: 'Costruisci un applicazione note con Vue 3, Composition API, Vue Router e Pinia.',
      en: 'Build a notes application with Vue 3, Composition API, Vue Router and Pinia.'
    },
    tasks: {
      it: [
        'Configura Vue Router con route /notes e /notes/:id',
        'Crea store Pinia per gestione note',
        'Implementa lista note con ricerca',
        'Aggiungi form creazione/modifica',
        'Gestisci persistenza in localStorage'
      ],
      en: [
        'Setup Vue Router with /notes and /notes/:id routes',
        'Create Pinia store for notes management',
        'Implement notes list with search',
        'Add create/edit form',
        'Handle persistence in localStorage'
      ]
    },
    successCriteria: {
      it: [
        'Navigazione tra lista e dettaglio',
        'Creazione e modifica note funzionanti',
        'Ricerca filtra in tempo reale',
        'Dati persistenti dopo refresh',
        'TypeScript strict attivo'
      ],
      en: [
        'Navigation between list and detail',
        'Note creation and editing working',
        'Search filters in real-time',
        'Data persists after refresh',
        'Strict TypeScript enabled'
      ]
    },
    hints: {
      it: [
        'Usa <script setup lang="ts">',
        'Store con setup pattern per type inference',
        'watchEffect per localStorage'
      ],
      en: [
        'Use <script setup lang="ts">',
        'Store with setup pattern for type inference',
        'watchEffect for localStorage'
      ]
    },
    estimatedMinutes: 90
  }
];


const redisLessons: TheoryLesson[] = [
  {
    id: 'redis-1',
    title: { it: 'Caching con Redis in Laravel', en: 'Caching with Redis in Laravel' },
    content: {
      it: 'Redis è un database in-memory che offre prestazioni eccezionali per caching e sessioni.\n\n' +
          '**Strategie di caching:**\n' +
          '- Cache-aside: l\'applicazione legge/scrive la cache manualmente\n' +
          '- Write-through: i dati vengono scritti contemporaneamente in cache e DB\n' +
          '- Write-behind: scrittura asincrona sul database\n\n' +
          '**Tipi di dati Redis:**\n' +
          '- Stringhe: valori semplici e contatori\n' +
          '- Hash: oggetti con campi multipli\n' +
          '- List: code ordinate\n' +
          '- Set: collezioni non ordinate senza duplicati\n' +
          '- Sorted Set: set ordinati per score',
      en: 'Redis is an in-memory database that delivers exceptional performance for caching and sessions.\n\n' +
          '**Caching strategies:**\n' +
          '- Cache-aside: application manually reads/writes the cache\n' +
          '- Write-through: data is written to cache and DB at the same time\n' +
          '- Write-behind: asynchronous write to the database\n\n' +
          '**Redis data types:**\n' +
          '- Strings: simple values and counters\n' +
          '- Hash: objects with multiple fields\n' +
          '- List: ordered queues\n' +
          '- Set: unordered collections without duplicates\n' +
          '- Sorted Set: sets ordered by score',
    },
    keyPoints: {
      it: [
        'Redis lavora in-memory per latenza sub-millisecond',
        'La strategia cache-aside è la più comune nelle app Laravel',
        'Gli hash Redis sono ideali per memorizzare oggetti utente',
        'I sorted set supportano range query per classifiche',
        'La persistenza RDB e AOF bilancia prestazioni e durabilità'
      ],
      en: [
        'Redis operates in-memory for sub-millisecond latency',
        'Cache-aside is the most common strategy in Laravel apps',
        'Redis hashes are ideal for storing user objects',
        'Sorted sets support range queries for leaderboards',
        'RDB and AOF persistence balance performance and durability'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\Cache;\n\n' +
              '// Cache-aside con Redis\n' +
              '$value = Cache::store(\'redis\')->remember(\'users:1\', 3600, function () {\n' +
              '    return User::find(1);\n' +
              '});\n\n' +
              '// Cache tags per invalidazione selettiva\n' +
              'Cache::store(\'redis\')->tags([\'users\', \'admins\'])->put(\'list\', $users, 3600);\n' +
              'Cache::store(\'redis\')->tags([\'users\'])->flush();',
        explanation: 'Utilizzo del facade Cache di Laravel con driver Redis e cache tags'
      },
      {
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\Redis;\n\n' +
              '// Hash per oggetto utente\n' +
              'Redis::hmset(\'user:1\', [\n' +
              '    \'name\' => \'Mario\',\n' +
              '    \'email\' => \'mario@example.com\',\n' +
              '    \'role\' => \'admin\'\n' +
              ']);\n\n' +
              'Sorted set per classifica\n' +
              'Redis::zadd(\'leaderboard\', 1500, \'user:1\');\n' +
              'Redis::zadd(\'leaderboard\', 2300, \'user:2\');\n' +
              '$top = Redis::zrevrange(\'leaderboard\', 0, 9, \'WITHSCORES\');',
        explanation: 'Hash e Sorted Set per strutture dati avanzate in Redis'
      }
    ],
    estimatedMinutes: 18
  },
  {
    id: 'redis-2',
    title: { it: 'Queue, Pub/Sub e Rate Limiting con Redis', en: 'Queues, Pub/Sub and Rate Limiting with Redis' },
    content: {
      it: 'Redis è la spina dorsale per job queues e comunicazione real-time in Laravel.\n\n' +
          '**Queue Workers:**\n' +
          '- I job vengono inseriti in una lista Redis\n' +
          '- I worker processano i job in background\n' +
          '- Supporto per retry, delay e priorità\n\n' +
          '**Pub/Sub:**\n' +
          'Un publisher invia messaggi a canali, i subscriber ricevono in real-time.\n' +
          'Utile per notifiche broadcast e websocket.\n\n' +
          '**Rate Limiting:**\n' +
          'Redis permette di contare richieste per chiave (IP, user ID) con TTL.\n' +
          'Laravel usa Redis per il throttle delle route e delle API.',
      en: 'Redis is the backbone for job queues and real-time communication in Laravel.\n\n' +
          '**Queue Workers:**\n' +
          '- Jobs are pushed to a Redis list\n' +
          '- Workers process jobs in the background\n' +
          '- Support for retry, delay and priorities\n\n' +
          '**Pub/Sub:**\n' +
          'A publisher sends messages to channels, subscribers receive in real-time.\n' +
          'Useful for broadcast notifications and websockets.\n\n' +
          '**Rate Limiting:**\n' +
          'Redis allows counting requests by key (IP, user ID) with TTL.\n' +
          'Laravel uses Redis for route and API throttling.',
    },
    keyPoints: {
      it: [
        'I worker Laravel gestiscono job in parallelo con processi multipli',
        'Il comando queue:work è pensato per produzione, queue:listen per sviluppo',
        'Pub/Sub è fire-and-forget: non garantisce persistenza',
        'Il rate limiting a sliding window è più preciso del fixed window',
        'Redis Stream è un\'alternativa moderna a Pub/Sub con persistenza'
      ],
      en: [
        'Laravel workers handle jobs in parallel with multiple processes',
        'queue:work is for production, queue:listen for development',
        'Pub/Sub is fire-and-forget: it does not guarantee persistence',
        'Sliding window rate limiting is more accurate than fixed window',
        'Redis Stream is a modern alternative to Pub/Sub with persistence'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\Redis;\n\n' +
              '// Pub/Sub con Redis\n' +
              'Redis::publish(\'notifications\', json_encode([\n' +
              '    \'message\' => \'Nuovo ordine ricevuto\',\n' +
              '    \'order_id\' => 123\n' +
              ']));\n\n' +
              '// Subscriber (in un comando artisan dedicato)\n' +
              'Redis::subscribe([\'notifications\'], function ($message) {\n' +
              '    $data = json_decode($message);\n' +
              '    Log::info(\'Notifica ricevuta: \' . $data->message);\n' +
              '});',
        explanation: 'Implementazione Pub/Sub con Redis in PHP'
      },
      {
        language: 'php',
        code: 'use Illuminate\\Cache\\RateLimiter;\n\n' +
              'app(RateLimiter::class)->for(\'api\', function ($request) {\n' +
              '    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());\n' +
              '});\n\n' +
              '// Rate limit manuale con Redis\n' +
              '$key = \'rate_limit:\' . $userId;\n' +
              '$attempts = Redis::incr($key);\n' +
              'if ($attempts === 1) {\n' +
              '    Redis::expire($key, 60);\n' +
              '}\n' +
              'if ($attempts > 100) {\n' +
              '    abort(429, \'Troppe richieste\');\n' +
              '}',
        explanation: 'Rate limiting con Redis in Laravel'
      }
    ],
    estimatedMinutes: 18
  }
];

const redisActivities: PracticalActivity[] = [
  {
    id: 'redis-activity-1',
    title: { it: 'Sistema di caching e queue per e-commerce', en: 'Caching and queue system for e-commerce' },
    description: {
      it: 'Costruisci un sistema di caching avanzato e job queue per un\'applicazione e-commerce Laravel. Implementa cache tags per i prodotti, una coda per l\'invio email, e rate limiting per le API pubbliche.',
      en: 'Build an advanced caching and job queue system for a Laravel e-commerce application. Implement cache tags for products, a queue for sending emails, and rate limiting for public APIs.'
    },
    tasks: {
      it: [
        'Configura Redis come driver per cache, sessioni e queue in config/database.php e .env',
        'Implementa cache-aside per la lista prodotti con cache tags [products, category:{id}]',
        'Crea un job SendOrderConfirmation che invia email in coda e usa retry con backoff',
        'Aggiungi rate limiting a 30 richieste/minuto per IP sulle API pubbliche',
        'Scrivi un comando Artisan che pulisca le cache di una categoria specifica usando tags'
      ],
      en: [
        'Configure Redis as the driver for cache, sessions and queue in config/database.php and .env',
        'Implement cache-aside for the product list with cache tags [products, category:{id}]',
        'Create a SendOrderConfirmation job that sends emails via queue and uses retry with backoff',
        'Add rate limiting at 30 requests/minute by IP for public APIs',
        'Write an Artisan command that clears cache for a specific category using tags'
      ]
    },
    successCriteria: {
      it: [
        'La lista prodotti si carica in meno di 50ms dopo il primo accesso',
        'L\'invalidazione della cache per categoria rimuove solo i record correlati',
        'L\'email di conferma viene processata in background dal worker',
        'Le API restituiscono 429 dopo 30 richieste nello stesso minuto',
        'I test PHPUnit verificano il comportamento di cache e queue'
      ],
      en: [
        'Product list loads in under 50ms after first access',
        'Category cache invalidation removes only related records',
        'Confirmation email is processed in the background by the worker',
        'APIs return 429 after 30 requests in the same minute',
        'PHPUnit tests verify cache and queue behavior'
      ]
    },
    hints: {
      it: [
        'Usa Cache::tags solo con driver che lo supportano (redis, dynamodb)',
        'Per testare le queue in ambiente locale, usa QUEUE_CONNECTION=sync nei test',
        'Ricorda di avviare il worker con php artisan queue:work redis --sleep=3 --tries=3'
      ],
      en: [
        'Use Cache::tags only with drivers that support it (redis, dynamodb)',
        'To test queues locally, use QUEUE_CONNECTION=sync in tests',
        'Remember to start the worker with php artisan queue:work redis --sleep=3 --tries=3'
      ]
    },
    estimatedMinutes: 75
  }
];

const ragLangchainLessons: TheoryLesson[] = [
  {
    id: 'rag-langchain-1',
    title: { it: 'Architettura RAG e Modelli di Embedding', en: 'RAG Architecture and Embedding Models' },
    content: {
      it: 'Retrieval Augmented Generation (RAG) combina ricerca su documenti con generazione di testo per ridurre le allucinazioni del modello.\n\n' +
          '**Fasi della pipeline RAG:**\n' +
          '1. Ingestion: caricamento e parsing dei documenti\n' +
          '2. Chunking: divisione in blocchi di dimensione ottimale\n' +
          '3. Embedding: conversione dei chunk in vettori numerici\n' +
          '4. Indexing: memorizzazione in un vector store\n' +
          '5. Retrieval: ricerca dei chunk più simili alla query\n' +
          '6. Generation: il modello genera la risposta basandosi sui chunk recuperati\n\n' +
          '**Modelli di embedding:**\n' +
          'OpenAI text-embedding-3-small/large, sentence-transformers, e modelli multilingua.',
      en: 'Retrieval Augmented Generation (RAG) combines document search with text generation to reduce model hallucinations.\n\n' +
          '**RAG pipeline stages:**\n' +
          '1. Ingestion: loading and parsing documents\n' +
          '2. Chunking: splitting into optimally sized blocks\n' +
          '3. Embedding: converting chunks into numerical vectors\n' +
          '4. Indexing: storing in a vector store\n' +
          '5. Retrieval: searching for chunks most similar to the query\n' +
          '6. Generation: the model generates the answer based on retrieved chunks\n\n' +
          '**Embedding models:**\n' +
          'OpenAI text-embedding-3-small/large, sentence-transformers, and multilingual models.',
    },
    keyPoints: {
      it: [
        'RAG riduce le allucinazioni fornendo contesto rilevante al modello',
        'La dimensione dei chunk influenza precisione e contesto: 256-512 token è un buon range',
        'Gli embedding catturano il significato semantico, non solo parole chiave',
        'La similarity search usa distanza coseno o Euclidean nel vector store',
        'L\'overlap tra chunk preserva il contesto ai bordi dei documenti'
      ],
      en: [
        'RAG reduces hallucinations by providing relevant context to the model',
        'Chunk size affects precision and context: 256-512 tokens is a good range',
        'Embeddings capture semantic meaning, not just keywords',
        'Similarity search uses cosine distance or Euclidean in the vector store',
        'Overlap between chunks preserves context at document boundaries'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use OpenAI;\n\n' +
              '// Generazione embedding con OpenAI\n' +
              '$client = OpenAI::client($apiKey);\n' +
              '$response = $client->embeddings()->create([\n' +
              '    \'model\' => \'text-embedding-3-small\',\n' +
              '    \'input\' => \'La fotosintesi clorofilliana...\',\n' +
              ']);\n\n' +
              '$embedding = $response->embeddings[0]->embedding;\n' +
              '// Vettore di 1536 dimensioni',
        explanation: 'Creazione di un embedding vettoriale con l\'API OpenAI'
      },
      {
        language: 'php',
        code: '// Chunking di un documento\n' +
              'function chunkText(string $text, int $chunkSize = 500, int $overlap = 50): array\n' +
              '{\n' +
              '    $chunks = [];\n' +
              '    $start = 0;\n' +
              '    while ($start < strlen($text)) {\n' +
              '        $chunks[] = substr($text, $start, $chunkSize);\n' +
              '        $start += $chunkSize - $overlap;\n' +
              '    }\n' +
              '    return $chunks;\n' +
              '}\n\n' +
              '// Similarità coseno tra due vettori\n' +
              'function cosineSimilarity(array $a, array $b): float\n' +
              '{\n' +
              '    $dot = array_sum(array_map(fn($x, $y) => $x * $y, $a, $b));\n' +
              '    $normA = sqrt(array_sum(array_map(fn($x) => $x * $x, $a)));\n' +
              '    $normB = sqrt(array_sum(array_map(fn($x) => $x * $x, $b)));\n' +
              '    return $dot / ($normA * $normB);\n' +
              '}',
        explanation: 'Chunking di documenti e calcolo similarity coseno in PHP'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'rag-langchain-2',
    title: { it: 'LangChain in PHP e Pipeline RAG', en: 'LangChain in PHP and RAG Pipeline' },
    content: {
      it: 'LangChain è un framework per costruire applicazioni LLM. In PHP esistono librerie come probots e langchain-php che implementano pattern simili.\n\n' +
          '**Concetti chiave LangChain:**\n' +
          '- Chains: sequenza di step (prompt -> modello -> parser)\n' +
          '- Retrievers: componente che recupera documenti rilevanti\n' +
          '- Memory: gestione della cronologia conversazione\n' +
          '- Agents: modello che decide quali tool usare\n\n' +
          '**Vector store ChromaDB:**\n' +
          'ChromaDB è un database vettoriale open-source.\n' +
          'Si integra con PHP tramite REST API o client HTTP.',
      en: 'LangChain is a framework for building LLM applications. In PHP there are libraries like probots and langchain-php that implement similar patterns.\n\n' +
          '**Key LangChain concepts:**\n' +
          '- Chains: sequence of steps (prompt -> model -> parser)\n' +
          '- Retrievers: component that retrieves relevant documents\n' +
          '- Memory: conversation history management\n' +
          '- Agents: model that decides which tools to use\n\n' +
          '**ChromaDB vector store:**\n' +
          'ChromaDB is an open-source vector database.\n' +
          'It integrates with PHP via REST API or HTTP client.',
    },
    keyPoints: {
      it: [
        'Una chain RAG combina retrieval e generation in un unico flusso',
        'Il prompt di sistema deve istruire il modello a usare solo il contesto fornito',
        'ChromaDB supporta filtri metadata per retrieval ibrido (semantico + keyword)',
        'La re-ranking migliora la qualità dei chunk recuperati',
        'Il pattern Tool/Agent permette al modello di interrogare database o API'
      ],
      en: [
        'A RAG chain combines retrieval and generation into a single flow',
        'The system prompt must instruct the model to use only the provided context',
        'ChromaDB supports metadata filters for hybrid retrieval (semantic + keyword)',
        'Re-ranking improves the quality of retrieved chunks',
        'The Tool/Agent pattern allows the model to query databases or APIs'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Probots\\Rune\\Chain;\n' +
              'use Probots\\Rune\\PromptTemplate;\n\n' +
              '// Chain semplice in PHP\n' +
              '$chain = Chain::make()\n' +
              '    ->link(new PromptTemplate(\n' +
              '        "Rispondi basandoti solo sul seguente contesto:\n{context}\n\nDomanda: {question}"\n' +
              '    ))\n' +
              '    ->link(new OpenAILLM($client, \'gpt-4o-mini\'));\n\n' +
              '$response = $chain->run([\n' +
              '    \'context\' => implode("\n", $retrievedChunks),\n' +
              '    \'question\' => \'Cos\'è la fotosintesi?\',\n' +
              ']);',
        explanation: 'Esempio di chain RAG con probots/langchain-php'
      },
      {
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\Http;\n\n' +
              '// Interrogazione ChromaDB via REST\n' +
              '$response = Http::post(\'http://localhost:8000/api/v1/collections/docs/query\', [\n' +
              '    \'query_embeddings\' => [$embedding],\n' +
              '    \'n_results\' => 5,\n' +
              '    \'where\' => [\'category\' => \'biologia\'],\n' +
              ']);\n\n' +
              '$chunks = $response->json(\'documents.0\');\n' +
              '$distances = $response->json(\'distances.0\');\n\n' +
              '// Aggiunta documenti a ChromaDB\n' +
              'Http::post(\'http://localhost:8000/api/v1/collections/docs/add\', [\n' +
              '    \'ids\' => [\'doc-1\', \'doc-2\'],\n' +
              '    \'embeddings\' => [$embedding1, $embedding2],\n' +
              '    \'metadatas\' => [[\'source\' => \'wiki\'], [\'source\' => \'book\']],\n' +
              '    \'documents\' => [$chunk1, $chunk2],\n' +
              ']);',
        explanation: 'Interazione con ChromaDB tramite API REST in PHP'
      }
    ],
    estimatedMinutes: 20
  }
];

const ragLangchainActivities: PracticalActivity[] = [
  {
    id: 'rag-langchain-activity-1',
    title: { it: 'Chatbot RAG per documentazione aziendale', en: 'RAG chatbot for company documentation' },
    description: {
      it: 'Costruisci una pipeline RAG completa in PHP che permetta agli utenti di fare domande su una documentazione aziendale. Carica i documenti in ChromaDB, genera embedding con OpenAI, e restituisci risposte basate sul contesto recuperato.',
      en: 'Build a complete RAG pipeline in PHP that allows users to ask questions about company documentation. Load documents into ChromaDB, generate embeddings with OpenAI, and return answers based on retrieved context.'
    },
    tasks: {
      it: [
        'Crea un service IngestionService che carichi file PDF/TXT, li chunki a 512 token con overlap di 50',
        'Implementa EmbeddingService che usi OpenAI text-embedding-3-small per generare vettori',
        'Configura ChromaDB in Docker e crea una collection con metadata (source, page, category)',
        'Costruisci RetrievalService che esegua similarity search e restituisci i top-5 chunk più rilevanti',
        'Crea un endpoint API Laravel che riceva una domanda, esegua RAG e restituisca la risposta con le fonti'
      ],
      en: [
        'Create an IngestionService that loads PDF/TXT files, chunks them at 512 tokens with 50 overlap',
        'Implement EmbeddingService that uses OpenAI text-embedding-3-small to generate vectors',
        'Configure ChromaDB in Docker and create a collection with metadata (source, page, category)',
        'Build RetrievalService that performs similarity search and returns the top-5 most relevant chunks',
        'Create a Laravel API endpoint that receives a question, performs RAG and returns the answer with sources'
      ]
    },
    successCriteria: {
      it: [
        'I documenti vengono chunkati correttamente con overlap mantenuto',
        'Gli embedding sono generati e memorizzati in ChromaDB con metadata completi',
        'La similarity search restituisce chunk pertinenti alla domanda dell\'utente',
        'La risposta dell\'LLM cita esplicitamente le fonti usate',
        'L\'endpoint API risponde in meno di 5 secondi per query semplici'
      ],
      en: [
        'Documents are correctly chunked with maintained overlap',
        'Embeddings are generated and stored in ChromaDB with complete metadata',
        'Similarity search returns chunks relevant to the user\'s question',
        'The LLM answer explicitly cites the sources used',
        'API endpoint responds in under 5 seconds for simple queries'
      ]
    },
    hints: {
      it: [
        'Usa una libreria come spatie/pdf-to-text o smalot/pdfparser per estrarre testo dai PDF',
        'Per chunkare in token anziché caratteri, usa una libreria tokenizer compatibile con gli embedding OpenAI',
        'Aggiungi un system prompt che vieti al modello di inventare informazioni non presenti nel contesto'
      ],
      en: [
        'Use a library like spatie/pdf-to-text or smalot/pdfparser to extract text from PDFs',
        'To chunk by tokens instead of characters, use a tokenizer library compatible with OpenAI embeddings',
        'Add a system prompt that forbids the model from inventing information not present in the context'
      ]
    },
    estimatedMinutes: 90
  }
];

const openaiPhpLessons: TheoryLesson[] = [
  {
    id: 'openai-php-1',
    title: { it: 'OpenAI SDK per PHP e Chat Completions', en: 'OpenAI SDK for PHP and Chat Completions' },
    content: {
      it: 'L\'SDK ufficiale OpenAI per PHP (openai-php/client) offre un wrapper type-safe per le API di OpenAI.\n\n' +
          '**Installazione:**\n' +
          'composer require openai-php/client\n\n' +
          '**Chat Completions API:**\n' +
          'Invia una lista di messaggi (system, user, assistant) e ricevi una risposta generata.\n' +
          'I parametri principali sono model, messages, temperature (0-2) e max_tokens.\n\n' +
          '**Function Calling:**\n' +
          'Permette al modello di chiamare funzioni definite dallo sviluppatore.\n' +
          'Il modello restituisce i parametri da passare alla funzione, non la esegue direttamente.',
      en: 'The official OpenAI SDK for PHP (openai-php/client) offers a type-safe wrapper for OpenAI APIs.\n\n' +
          '**Installation:**\n' +
          'composer require openai-php/client\n\n' +
          '**Chat Completions API:**\n' +
          'Send a list of messages (system, user, assistant) and receive a generated response.\n' +
          'Main parameters are model, messages, temperature (0-2) and max_tokens.\n\n' +
          '**Function Calling:**\n' +
          'Allows the model to call functions defined by the developer.\n' +
          'The model returns the parameters to pass to the function, it does not execute it directly.',
    },
    keyPoints: {
      it: [
        'L\'SDK openai-php/client usa oggetti DTO per richieste e risposte',
        'Il messaggio di system definisce il comportamento e i vincoli del modello',
        'Temperature 0 produce risposte deterministiche, 2 molto creative',
        'Function calling richiede di descrivere le funzioni nel campo tools',
        'Ogni messaggio nella conversazione ha un ruolo: system, user, assistant o tool'
      ],
      en: [
        'The openai-php/client SDK uses DTO objects for requests and responses',
        'The system message defines the model\'s behavior and constraints',
        'Temperature 0 produces deterministic responses, 2 very creative ones',
        'Function calling requires describing functions in the tools field',
        'Each message in the conversation has a role: system, user, assistant or tool'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'require \'vendor/autoload.php\';\n' +
              'use OpenAI;\n\n' +
              '$client = OpenAI::client(getenv(\'OPENAI_API_KEY\'));\n\n' +
              '$response = $client->chat()->create([\n' +
              '    \'model\' => \'gpt-4o-mini\',\n' +
              '    \'messages\' => [\n' +
              '        [\'role\' => \'system\', \'content\' => \'Sei un assistente tecnico esperto di Laravel.\'],\n' +
              '        [\'role\' => \'user\', \'content\' => \'Come si configura il caching?\'],\n' +
              '    ],\n' +
              '    \'temperature\' => 0.7,\n' +
              '    \'max_tokens\' => 500,\n' +
              ']);\n\n' +
              'echo $response->choices[0]->message->content;',
        explanation: 'Chiamata base alla Chat Completions API con SDK PHP'
      },
      {
        language: 'php',
        code: '$response = $client->chat()->create([\n' +
              '    \'model\' => \'gpt-4o-mini\',\n' +
              '    \'messages\' => [[\'role\' => \'user\', \'content\' => \'Che tempo fa a Roma?\']],\n' +
              '    \'tools\' => [[\n' +
              '        \'type\' => \'function\',\n' +
              '        \'function\' => [\n' +
              '            \'name\' => \'get_weather\',\n' +
              '            \'description\' => \'Ottiene il meteo per una città\',\n' +
              '            \'parameters\' => [\n' +
              '                \'type\' => \'object\',\n' +
              '                \'properties\' => [\n' +
              '                    \'city\' => [\'type\' => \'string\', \'description\' => \'Nome città\'],\n' +
              '                ],\n' +
              '                \'required\' => [\'city\'],\n' +
              '            ],\n' +
              '        ],\n' +
              '    ]],\n' +
              ']);\n\n' +
              '$toolCall = $response->choices[0]->message->toolCalls[0];\n' +
              '$args = json_decode($toolCall->function->arguments, true);\n' +
              '$weather = get_weather($args[\'city\']);',
        explanation: 'Function calling: il modello richiede l\'esecuzione di una funzione definita'
      }
    ],
    estimatedMinutes: 18
  },
  {
    id: 'openai-php-2',
    title: { it: 'Streaming, Conversazione e Gestione Token', en: 'Streaming, Conversation and Token Management' },
    content: {
      it: 'Per applicazioni interattive è fondamentale gestire streaming, cronologia conversazione e costi dei token.\n\n' +
          '**Streaming responses:**\n' +
          'La risposta arriva in chunk via SSE (Server-Sent Events).\n' +
          'Ogni chunk contiene un delta di testo che viene concatenato.\n\n' +
          '**Conversation history:**\n' +
          'I messaggi precedenti devono essere inclusi in ogni richiesta.\n' +
          'Attenzione ai limiti del context window del modello.\n\n' +
          '**Token counting:**\n' +
          'I costi dipendono dai token di input e output.\n' +
          'Usa tiktoken o stime approssimative per controllare il budget.\n\n' +
          '**Error handling:**\n' +
          'Rate limits, timeout, token overflow e errori di validazione vanno gestiti con retry e fallback.',
      en: 'For interactive applications it is essential to manage streaming, conversation history and token costs.\n\n' +
          '**Streaming responses:**\n' +
          'The response arrives in chunks via SSE (Server-Sent Events).\n' +
          'Each chunk contains a text delta that is concatenated.\n\n' +
          '**Conversation history:**\n' +
          'Previous messages must be included in every request.\n' +
          'Beware of the model\'s context window limits.\n\n' +
          '**Token counting:**\n' +
          'Costs depend on input and output tokens.\n' +
          'Use tiktoken or approximate estimates to control budget.\n\n' +
          '**Error handling:**\n' +
          'Rate limits, timeouts, token overflow and validation errors must be handled with retry and fallback.',
    },
    keyPoints: {
      it: [
        'Lo streaming riduce la percezione di latenza mostrando il testo progressivamente',
        'Il context window di gpt-4o-mini è 128k token, gpt-4o è 128k',
        'I token di sistema contano nel limite totale: riassumi la cronologia se necessario',
        'Le API OpenAI restituiscono header con i token usati (usage) nelle risposte non-streaming',
        'Gestisci sempre errori API con retry esponenziale e fallback user-friendly'
      ],
      en: [
        'Streaming reduces perceived latency by showing text progressively',
        'The context window of gpt-4o-mini is 128k tokens, gpt-4o is 128k',
        'System tokens count toward the total limit: summarize history when needed',
        'OpenAI APIs return headers with tokens used (usage) in non-streaming responses',
        'Always handle API errors with exponential retry and user-friendly fallback'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use OpenAI;\n\n' +
              '$client = OpenAI::client($apiKey);\n\n' +
              '// Streaming con generator PHP\n' +
              'function streamChat($client, $messages) {\n' +
              '    $stream = $client->chat()->createStreamed([\n' +
              '        \'model\' => \'gpt-4o-mini\',\n' +
              '        \'messages\' => $messages,\n' +
              '    ]);\n\n' +
              '    foreach ($stream as $response) {\n' +
              '        $delta = $response->choices[0]->delta->content ?? \'\';\n' +
              '        yield $delta;\n' +
              '    }\n' +
              '}\n\n' +
              '// Uso in un controller Laravel con SSE\n' +
              'return response()->stream(function () use ($client, $messages) {\n' +
              '    foreach (streamChat($client, $messages) as $chunk) {\n' +
              '        echo "data: " . json_encode([\'text\' => $chunk]) . "\\n\\n";\n' +
              '        ob_flush(); flush();\n' +
              '    }\n' +
              '    echo "data: [DONE]\\n\\n";\n' +
              '}, 200, [\'Content-Type\' => \'text/event-stream\']);',
        explanation: 'Implementazione dello streaming con Server-Sent Events in Laravel'
      },
      {
        language: 'php',
        code: '// Stima token (approssimativa)\n' +
              'function estimateTokens(string $text): int\n' +
              '{\n' +
              '    return (int) ceil(strlen($text) / 4);\n' +
              '}\n\n' +
              '// Retry esponenziale con jitter\n' +
              'function chatWithRetry($client, $params, int $maxRetries = 3)\n' +
              '{\n' +
              '    $attempt = 0;\n' +
              '    while (true) {\n' +
              '        try {\n' +
              '            return $client->chat()->create($params);\n' +
              '        } catch (\\OpenAI\\Exceptions\\ErrorException $e) {\n' +
              '            if ($e->getErrorCode() !== \'rate_limit_exceeded\' || $attempt >= $maxRetries) {\n' +
              '                throw $e;\n' +
              '            }\n' +
              '            $delay = (int) pow(2, $attempt) * 1000 + random_int(0, 500);\n' +
              '            usleep($delay * 1000);\n' +
              '            $attempt++;\n' +
              '        }\n' +
              '    }\n' +
              '}',
        explanation: 'Stima token e gestione retry con backoff esponenziale'
      }
    ],
    estimatedMinutes: 18
  }
];

const openaiPhpActivities: PracticalActivity[] = [
  {
    id: 'openai-php-activity-1',
    title: { it: 'Assistente AI conversazionale con streaming', en: 'Conversational AI assistant with streaming' },
    description: {
      it: 'Sviluppa un assistente AI in PHP che supporti conversazioni multi-turn con streaming delle risposte, gestione della cronologia, e function calling per recuperare dati da un database.',
      en: 'Develop a PHP AI assistant that supports multi-turn conversations with streaming responses, history management, and function calling to retrieve data from a database.'
    },
    tasks: {
      it: [
        'Installa openai-php/client e configura la chiave API tramite variabili d\'ambiente',
        'Crea un endpoint API che riceva messaggi utente e restituisca risposte in streaming con Server-Sent Events',
        'Implementa una classe ConversationManager che mantenga la cronologia e la riassumi se supera 80% del context window',
        'Aggiungi una function call get_orders_by_user che interroghi il database e restituisca i dati al modello',
        'Gestisci errori API con retry esponenziale e fallback a messaggio di errore user-friendly'
      ],
      en: [
        'Install openai-php/client and configure the API key via environment variables',
        'Create an API endpoint that receives user messages and returns streaming responses with Server-Sent Events',
        'Implement a ConversationManager class that maintains history and summarizes it if it exceeds 80% of context window',
        'Add a function call get_orders_by_user that queries the database and returns data to the model',
        'Handle API errors with exponential retry and fallback to user-friendly error message'
      ]
    },
    successCriteria: {
      it: [
        'Le risposte vengono visualizzate progressivamente nel client (streaming attivo)',
        'La cronologia conversazione è persistente tra le richieste (sessione o DB)',
        'Quando la cronologia è troppo lunga, viene generato un riassunto automatico',
        'La function call recupera ordini reali dal database e il modello li include nella risposta',
        'In caso di errore API, l\'utente riceve un messaggio chiaro senza crash del server'
      ],
      en: [
        'Responses are displayed progressively in the client (active streaming)',
        'Conversation history is persistent between requests (session or DB)',
        'When history is too long, an automatic summary is generated',
        'Function call retrieves real orders from the database and the model includes them in the answer',
        'In case of API error, the user receives a clear message without server crash'
      ]
    },
    hints: {
      it: [
        'Per lo streaming, usa $client->chat()->createStreamed() e un generator PHP per emettere i chunk',
        'Conta i token con una stima approssimativa: 1 token ≈ 4 caratteri in italiano/inglese',
        'Per il riassunto, invia una richiesta separata che riassuma i messaggi più vecchi in un unico messaggio di system'
      ],
      en: [
        'For streaming, use $client->chat()->createStreamed() and a PHP generator to emit chunks',
        'Count tokens with an approximate estimate: 1 token ≈ 4 characters in Italian/English',
        'For summarization, send a separate request that summarizes the oldest messages into a single system message'
      ]
    },
    estimatedMinutes: 90
  }
];


const mysqlAcidLessons: TheoryLesson[] = [
  {
    id: 'mysql-acid-1',
    title: { it: 'Proprieta ACID e Livelli di Isolamento', en: 'ACID Properties and Isolation Levels' },
    content: {
      it: 'Una transazione MySQL e un insieme di operazioni che devono essere eseguite in modo atomico.\n\n' +
          'Le proprieta ACID sono:\n' +
          '- **Atomicity**: tutto o niente\n' +
          '- **Consistency**: il DB passa da uno stato valido a un altro\n' +
          '- **Isolation**: le transazioni concorrenti non interferiscono\n' +
          '- **Durability**: i dati persistono dopo un commit\n\n' +
          'I livelli di isolamento sono:\n' +
          '- READ UNCOMMITTED\n' +
          '- READ COMMITTED\n' +
          '- REPEATABLE READ (default in InnoDB)\n' +
          '- SERIALIZABLE',
      en: 'A MySQL transaction is a set of operations that must be executed atomically.\n\n' +
          'The ACID properties are:\n' +
          '- **Atomicity**: all or nothing\n' +
          '- **Consistency**: the DB moves from one valid state to another\n' +
          '- **Isolation**: concurrent transactions do not interfere\n' +
          '- **Durability**: data persists after a commit\n\n' +
          'The isolation levels are:\n' +
          '- READ UNCOMMITTED\n' +
          '- READ COMMITTED\n' +
          '- REPEATABLE READ (default in InnoDB)\n' +
          '- SERIALIZABLE',
    },
    keyPoints: {
      it: [
        'Atomicity garantisce rollback in caso di errore',
        'InnoDB usa REPEATABLE READ di default',
        'SERIALIZABLE elimina phantom read ma penalizza le performance',
        'READ UNCOMMITTED permette dirty read',
        'La scelta del livello influenza lock e concurrency'
      ],
      en: [
        'Atomicity guarantees rollback on error',
        'InnoDB defaults to REPEATABLE READ',
        'SERIALIZABLE eliminates phantom reads but hurts performance',
        'READ UNCOMMITTED allows dirty reads',
        'The chosen level affects locking and concurrency'
      ]
    },
    codeExamples: [
      {
        language: 'sql',
        code: 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n' +
              'START TRANSACTION;\n' +
              'UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n' +
              'UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n' +
              'COMMIT;',
        explanation: 'Transazione con livello READ COMMITTED'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'mysql-acid-2',
    title: { it: 'Locking: Ottimistico vs Pessimistico e Deadlock', en: 'Locking: Optimistic vs Pessimistic and Deadlocks' },
    content: {
      it: 'MySQL usa lock condivisi (S) ed esclusivi (X) per gestire la concorrenza.\n\n' +
          '**Pessimistic locking**: blocca i record subito con SELECT ... FOR UPDATE.\n' +
          '**Optimistic locking**: non blocca, ma verifica la versione al momento dell\'update (es. campo version).\n\n' +
          'Un deadlock avviene quando due transazioni si bloccano a vicenda.\n' +
          'MySQL rileva i deadlock e fa rollback della transazione piu leggera.\n\n' +
          'In Laravel: DB::transaction() gestisce automaticamente commit e rollback.',
      en: 'MySQL uses shared (S) and exclusive (X) locks to manage concurrency.\n\n' +
          '**Pessimistic locking**: locks records immediately with SELECT ... FOR UPDATE.\n' +
          '**Optimistic locking**: does not lock, but checks version at update time (e.g., version field).\n\n' +
          'A deadlock occurs when two transactions block each other.\n' +
          'MySQL detects deadlocks and rolls back the lighter transaction.\n\n' +
          'In Laravel: DB::transaction() automatically handles commit and rollback.',
    },
    keyPoints: {
      it: [
        'SELECT ... FOR UPDATE blocca in scrittura',
        'SELECT ... LOCK IN SHARE MODE blocca in lettura condivisa',
        'Optimistic locking riduce contesa ma richiede retry',
        'Deadlock si risolve ordinando gli accessi alle tabelle',
        'Laravel DB::transaction() gestisce rollback automatico'
      ],
      en: [
        'SELECT ... FOR UPDATE locks for writing',
        'SELECT ... LOCK IN SHARE MODE locks for shared reading',
        'Optimistic locking reduces contention but requires retries',
        'Deadlocks are resolved by ordering table accesses',
        'Laravel DB::transaction() handles automatic rollback'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\DB;\n\n' +
              'DB::transaction(function () {\n' +
              '    $user = User::lockForUpdate()->find(1);\n' +
              '    $user->balance -= 100;\n' +
              '    $user->save();\n' +
              '});',
        explanation: 'Laravel transaction con pessimistic locking'
      },
      {
        language: 'sql',
        code: 'SELECT * FROM orders WHERE id = 1 FOR UPDATE;',
        explanation: 'Pessimistic lock su una riga'
      }
    ],
    estimatedMinutes: 20
  }
];

const mysqlAcidActivities: PracticalActivity[] = [
  {
    id: 'mysql-acid-activity-1',
    title: { it: 'Gestione Transazioni Bancarie', en: 'Bank Transaction Management' },
    description: {
      it: 'Implementa un sistema di trasferimento fondi con gestione deadlock e livelli di isolamento.',
      en: 'Implement a fund transfer system with deadlock handling and isolation levels.'
    },
    tasks: {
      it: [
        'Crea la tabella accounts con campo balance e version',
        'Implementa trasferimento con DB::transaction() e lockForUpdate()',
        'Gestisci il deadlock catchando QueryException',
        'Aggiungi un metodo di trasferimento con optimistic locking (campo version)',
        'Scrivi test che simulano concorrenza tra due trasferimenti simultanei'
      ],
      en: [
        'Create the accounts table with balance and version fields',
        'Implement transfer with DB::transaction() and lockForUpdate()',
        'Handle deadlock by catching QueryException',
        'Add a transfer method with optimistic locking (version field)',
        'Write tests simulating concurrency between two simultaneous transfers'
      ]
    },
    successCriteria: {
      it: [
        'La tabella accounts usa InnoDB',
        'Il trasferimento pessimistico blocca correttamente i record',
        'Il deadlock viene intercettato e gestito',
        'L\'optimistic locking lancia eccezione in caso di conflitto',
        'I test dimostrano coerenza dei saldi sotto carico concorrente'
      ],
      en: [
        'The accounts table uses InnoDB',
        'Pessimistic transfer correctly locks records',
        'Deadlock is caught and handled',
        'Optimistic locking throws exception on conflict',
        'Tests demonstrate balance consistency under concurrent load'
      ]
    },
    hints: {
      it: [
        'Usa DB::transaction(function () { ... }, 5) per 5 retry',
        'Per deadlock, controlla $e->getCode() == 40001',
        'L\'optimistic locking richiede WHERE version = :version nel UPDATE'
      ],
      en: [
        'Use DB::transaction(function () { ... }, 5) for 5 retries',
        'For deadlocks, check $e->getCode() == 40001',
        'Optimistic locking requires WHERE version = :version in the UPDATE'
      ]
    },
    estimatedMinutes: 90
  }
];

const awsBasicsLessons: TheoryLesson[] = [
  {
    id: 'aws-basics-1',
    title: { it: 'AWS IAM, S3 e EC2', en: 'AWS IAM, S3 and EC2' },
    content: {
      it: 'AWS offre servizi gestiti per storage e computing.\n\n' +
          '**IAM**: gestione utenti, ruoli e policy con principio del minor privilegio.\n' +
          '**S3**: object storage con bucket, key e versionamento. Le classi di storage includono Standard, IA e Glacier.\n' +
          '**EC2**: istanze virtuali con tipologie (t3, m5, c5), security groups e key pair SSH.\n\n' +
          'Laravel supporta S3 tramite il filesystem driver `s3`.',
      en: 'AWS offers managed services for storage and computing.\n\n' +
          '**IAM**: user, role and policy management with least privilege principle.\n' +
          '**S3**: object storage with buckets, keys and versioning. Storage classes include Standard, IA and Glacier.\n' +
          '**EC2**: virtual instances with types (t3, m5, c5), security groups and SSH key pairs.\n\n' +
          'Laravel supports S3 via the `s3` filesystem driver.',
    },
    keyPoints: {
      it: [
        'IAM policy definiscono azioni permesse su risorse specifiche',
        'S3 bucket names sono globalmente unici',
        'Security Groups sono stateful e agiscono a livello di istanza',
        'Laravel usa league/flysystem-aws-s3-v3 per S3',
        'EC2 richiede key pair per accesso SSH'
      ],
      en: [
        'IAM policies define allowed actions on specific resources',
        'S3 bucket names are globally unique',
        'Security Groups are stateful and act at the instance level',
        'Laravel uses league/flysystem-aws-s3-v3 for S3',
        'EC2 requires a key pair for SSH access'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'Storage::disk(\'s3\')->put(\'avatars/1.jpg\', $fileContents);\n' +
              '$url = Storage::disk(\'s3\')->url(\'avatars/1.jpg\');',
        explanation: 'Salvataggio e recupero file su S3 da Laravel'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'aws-basics-2',
    title: { it: 'RDS e Deploy di Laravel su EC2', en: 'RDS and Laravel Deployment on EC2' },
    content: {
      it: 'Amazon RDS fornisce database gestiti (MySQL, PostgreSQL, MariaDB).\n\n' +
          'Vantaggi: backup automatici, patching, Multi-AZ, read replicas.\n' +
          'Il security group di RDS deve permettere connessioni sulla porta 3306 solo dall\'EC2.\n\n' +
          'Per deployare Laravel su EC2:\n' +
          '- Installa PHP, Composer, Nginx/Apache\n' +
          '- Configura .env con endpoint RDS\n' +
          '- Usa Supervisor per le queue\n' +
          '- Configura HTTPS con ACM o Let\'s Encrypt',
      en: 'Amazon RDS provides managed databases (MySQL, PostgreSQL, MariaDB).\n\n' +
          'Benefits: automated backups, patching, Multi-AZ, read replicas.\n' +
          'The RDS security group must allow connections on port 3306 only from the EC2 instance.\n\n' +
          'To deploy Laravel on EC2:\n' +
          '- Install PHP, Composer, Nginx/Apache\n' +
          '- Configure .env with RDS endpoint\n' +
          '- Use Supervisor for queues\n' +
          '- Configure HTTPS with ACM or Let\'s Encrypt',
    },
    keyPoints: {
      it: [
        'RDS elimina la gestione manuale del DB server',
        'Il security group EC2 apre 80/443 verso internet',
        'Il security group RDS apre 3306 solo al security group EC2',
        'Usa env vars per credenziali, mai nel codice',
        'Supervisor gestisce i worker delle queue Laravel'
      ],
      en: [
        'RDS eliminates manual DB server management',
        'EC2 security group opens 80/443 to the internet',
        'RDS security group opens 3306 only to the EC2 security group',
        'Use env vars for credentials, never in code',
        'Supervisor manages Laravel queue workers'
      ]
    },
    codeExamples: [
      {
        language: 'bash',
        code: 'sudo apt update && sudo apt install php8.2-fpm nginx composer\n' +
              'sudo systemctl enable php8.2-fpm\n' +
              'sudo systemctl enable nginx',
        explanation: 'Installazione stack LEMP su EC2 (Ubuntu)'
      },
      {
        language: 'ini',
        code: '[program:laravel-worker]\n' +
              'process_name=%(program_name)s_%(process_num)02d\n' +
              'command=php /var/www/app/artisan queue:work\n' +
              'autostart=true\n' +
              'autorestart=true\n' +
              'user=www-data',
        explanation: 'Configurazione Supervisor per le queue'
      }
    ],
    estimatedMinutes: 20
  }
];

const awsBasicsActivities: PracticalActivity[] = [
  {
    id: 'aws-basics-activity-1',
    title: { it: 'Deploy Laravel con S3 e RDS', en: 'Deploy Laravel with S3 and RDS' },
    description: {
      it: 'Configura un ambiente AWS completo: S3 per gli upload, RDS per il database e EC2 per l\'applicazione Laravel.',
      en: 'Set up a complete AWS environment: S3 for uploads, RDS for the database, and EC2 for the Laravel application.'
    },
    tasks: {
      it: [
        'Crea un bucket S3 privato con policy IAM per l\'EC2',
        'Crea un\'istanza RDS MySQL in una subnet privata',
        'Lancia un\'istanza EC2 e configura Nginx + PHP-FPM',
        'Clona il progetto Laravel, installa dipendenze e configura .env',
        'Implementa upload avatar su S3 e verifica accesso all\'app'
      ],
      en: [
        'Create a private S3 bucket with IAM policy for EC2',
        'Create an RDS MySQL instance in a private subnet',
        'Launch an EC2 instance and configure Nginx + PHP-FPM',
        'Clone the Laravel project, install dependencies and configure .env',
        'Implement avatar upload to S3 and verify app access'
      ]
    },
    successCriteria: {
      it: [
        'L\'upload avatar viene salvato su S3 e non in local',
        'L\'applicazione si connette a RDS e migra le tabelle',
        'EC2 e RDS comunicano tramite security group rules',
        'L\'applicazione risponde su HTTP 80 dall\'IP pubblico EC2',
        'I log di errore Laravel sono visibili in storage/logs'
      ],
      en: [
        'Avatar upload is saved to S3 and not locally',
        'The app connects to RDS and migrates tables',
        'EC2 and RDS communicate via security group rules',
        'The app responds on HTTP 80 from the EC2 public IP',
        'Laravel error logs are visible in storage/logs'
      ]
    },
    hints: {
      it: [
        'Configura il filesystem driver su s3 in config/filesystems.php',
        'RDS richiede di creare il DB e l\'utente prima della connessione',
        'Ricorda chmod -R 775 storage bootstrap/cache su EC2'
      ],
      en: [
        'Configure the filesystem driver to s3 in config/filesystems.php',
        'RDS requires creating the DB and user before connecting',
        'Remember chmod -R 775 storage bootstrap/cache on EC2'
      ]
    },
    estimatedMinutes: 90
  }
];

const symfonyBasicsLessons: TheoryLesson[] = [
  {
    id: 'symfony-basics-1',
    title: { it: 'Componenti Symfony e Dependency Injection', en: 'Symfony Components and Dependency Injection' },
    content: {
      it: 'Laravel e costruito su componenti Symfony che forniscono fondamenta robuste.\n\n' +
          '**Console**: gestione comandi CLI (Artisan si basa su Symfony Console).\n' +
          '**HTTP Foundation**: Request, Response, Session e gestione del flusso HTTP.\n' +
          '**Routing**: matching URL a controller e middleware.\n' +
          '**Event Dispatcher**: pattern Observer per eventi e listener.\n' +
          '**DI Container**: gestione dipendenze, autowiring e service provider.\n\n' +
          'Il Container DI risolve le dipendenze ricorsivamente iniettando costruttori.',
      en: 'Laravel is built on Symfony components that provide robust foundations.\n\n' +
          '**Console**: CLI command management (Artisan is based on Symfony Console).\n' +
          '**HTTP Foundation**: Request, Response, Session and HTTP flow management.\n' +
          '**Routing**: URL matching to controllers and middleware.\n' +
          '**Event Dispatcher**: Observer pattern for events and listeners.\n' +
          '**DI Container**: dependency management, autowiring and service providers.\n\n' +
          'The DI Container recursively resolves dependencies by injecting constructors.',
    },
    keyPoints: {
      it: [
        'Symfony Console gestisce input, output e helper per CLI',
        'HTTP Foundation astrae superglobali PHP in oggetti testabili',
        'Il Router Symfony e usato da Laravel per il matching delle rotte',
        'Il DI Container di Laravel estende quello Symfony',
        'Autowiring risolve classi con type-hint nel costruttore'
      ],
      en: [
        'Symfony Console handles input, output and CLI helpers',
        'HTTP Foundation abstracts PHP superglobals into testable objects',
        'The Symfony Router is used by Laravel for route matching',
        'The Laravel DI Container extends the Symfony one',
        'Autowiring resolves classes with constructor type hints'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Symfony\\Component\\Console\\Command\\Command;\n' +
              'use Symfony\\Component\\Console\\Input\\InputInterface;\n' +
              'use Symfony\\Component\\Console\\Output\\OutputInterface;\n\n' +
              'class GreetCommand extends Command\n' +
              '{\n' +
              '    protected static $defaultName = \'app:greet\';\n' +
              '    protected function execute(InputInterface $input, OutputInterface $output)\n' +
              '    {\n' +
              '        $output->writeln(\'Hello Symfony Console!\');\n' +
              '        return Command::SUCCESS;\n' +
              '    }\n' +
              '}',
        explanation: 'Comando CLI con Symfony Console'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'symfony-basics-2',
    title: { it: 'Validator, Serializer e Event Dispatcher', en: 'Validator, Serializer and Event Dispatcher' },
    content: {
      it: 'Symfony fornisce strumenti per validazione, serializzazione e comunicazione tra componenti.\n\n' +
          '**Validator**: constraint su proprieta (NotBlank, Email, Length, Type, Callback).\n' +
          'Il ValidationBuilder compila le regole e produce violazioni.\n\n' +
          '**Serializer**: conversione oggetti in JSON/XML e viceversa tramite Normalizer e Encoder.\n' +
          'I gruppi di serializzazione permettono di filtrare i campi esposti.\n\n' +
          '**Event Dispatcher**:\n' +
          '- Si definiscono eventi (classi o stringhe)\n' +
          '- Si registrano listener o subscriber\n' +
          '- Si dispatcha l\'evento nel flusso applicativo',
      en: 'Symfony provides tools for validation, serialization and communication between components.\n\n' +
          '**Validator**: constraints on properties (NotBlank, Email, Length, Type, Callback).\n' +
          'The ValidationBuilder compiles rules and produces violations.\n\n' +
          '**Serializer**: object conversion to JSON/XML and back via Normalizer and Encoder.\n' +
          'Serialization groups allow filtering exposed fields.\n\n' +
          '**Event Dispatcher**:\n' +
          '- Define events (classes or strings)\n' +
          '- Register listeners or subscribers\n' +
          '- Dispatch the event in the application flow',
    },
    keyPoints: {
      it: [
        'Le constraint Validator sono annotazioni o attributi PHP 8',
        'Il Serializer usa ObjectNormalizer per oggetti complessi',
        'I gruppi di serializzazione controllano l\'esposizione dei campi',
        'Event Subscriber centralizza la logica di ascolto',
        'Laravel Event system e ispirato a Symfony EventDispatcher'
      ],
      en: [
        'Validator constraints are annotations or PHP 8 attributes',
        'The Serializer uses ObjectNormalizer for complex objects',
        'Serialization groups control field exposure',
        'Event Subscriber centralizes listening logic',
        'The Laravel Event system is inspired by Symfony EventDispatcher'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: 'use Symfony\\Component\\Validator\\Constraints as Assert;\n\n' +
              'class UserDto\n' +
              '{\n' +
              '    #[Assert\\NotBlank]\n' +
              '    #[Assert\\Length(min: 3, max: 50)]\n' +
              '    public string $name;\n\n' +
              '    #[Assert\\Email]\n' +
              '    public string $email;\n' +
              '}',
        explanation: 'DTO con constraint Validator PHP 8'
      },
      {
        language: 'php',
        code: 'use Symfony\\Component\\Serializer\\Serializer;\n\n' +
              '$json = $serializer->serialize($user, \'json\', [\n' +
              '    \'groups\' => [\'public\']\n' +
              ']);',
        explanation: 'Serializzazione con gruppi'
      }
    ],
    estimatedMinutes: 20
  }
];

const symfonyBasicsActivities: PracticalActivity[] = [
  {
    id: 'symfony-basics-activity-1',
    title: { it: 'Mini App con DI, Eventi e Validazione', en: 'Mini App with DI, Events and Validation' },
    description: {
      it: 'Costruisci una mini applicazione PHP che usa il DI Container, l\'Event Dispatcher e il Validator di Symfony senza Laravel.',
      en: 'Build a mini PHP application using Symfony DI Container, Event Dispatcher and Validator without Laravel.'
    },
    tasks: {
      it: [
        'Configura il DI Container con definizioni di servizi e autowiring',
        'Crea un OrderService che dipende da PaymentGatewayInterface',
        'Definisci un evento OrderPlaced e un listener che invia email',
        'Crea un DTO OrderRequest con constraint Validator (NotBlank, Positive, Email)',
        'Scrivi uno script CLI che riceve input, valida e dispatcia l\'evento'
      ],
      en: [
        'Configure the DI Container with service definitions and autowiring',
        'Create an OrderService that depends on PaymentGatewayInterface',
        'Define an OrderPlaced event and a listener that sends an email',
        'Create an OrderRequest DTO with Validator constraints (NotBlank, Positive, Email)',
        'Write a CLI script that receives input, validates and dispatches the event'
      ]
    },
    successCriteria: {
      it: [
        'Il container risolve OrderService iniettando l\'implementazione di PaymentGateway',
        'L\'evento OrderPlaced viene dispatchato dopo la validazione',
        'Il listener riceve l\'evento e stampa un messaggio',
        'La validazione rifiuta input non validi con messaggi chiari',
        'Lo script termina con codice 0 in caso di successo, 1 in caso di errore'
      ],
      en: [
        'The container resolves OrderService injecting the PaymentGateway implementation',
        'The OrderPlaced event is dispatched after validation',
        'The listener receives the event and prints a message',
        'Validation rejects invalid input with clear messages',
        'The script exits with code 0 on success, 1 on error'
      ]
    },
    hints: {
      it: [
        'Usa Symfony\\Component\\DependencyInjection\\ContainerBuilder',
        'Registra il listener con $dispatcher->addListener()',
        'Il ValidatorFactory si ottiene da Validation::createValidator()'
      ],
      en: [
        'Use Symfony\\Component\\DependencyInjection\\ContainerBuilder',
        'Register the listener with $dispatcher->addListener()',
        'The ValidatorFactory is obtained from Validation::createValidator()'
      ]
    },
    estimatedMinutes: 90
  }
];


const embeddingsChromadbLessons: TheoryLesson[] = [
  {
    id: 'embeddings-chromadb-1',
    title: {
      it: 'Introduzione agli Embeddings e Similarita Vettoriale',
      en: 'Introduction to Embeddings and Vector Similarity'
    },
    content: {
      it: 'Gli embeddings sono rappresentazioni vettoriali dense di dati (testo, immagini, audio) in uno spazio multidimensionale.\n\n' +
          '**Perche sono importanti:**\n' +
          '- Catturano il significato semantico del contenuto\n' +
          '- Permettono confronti basati su similarita, non su keyword esatte\n' +
          '- Sono la base della ricerca semantica e dei RAG\n\n' +
          '**Modelli OpenAI:**\n' +
          '- text-embedding-ada-002: modello legacy, 1536 dimensioni\n' +
          '- text-embedding-3-small: piu veloce ed economico\n' +
          '- text-embedding-3-large: qualita superiore, 3072 dimensioni\n\n' +
          '**Metriche di similarita:**\n' +
          '- Cosine similarity: misura l\'angolo tra due vettori, utile per confrontare direzione\n' +
          '- Euclidean distance: misura la distanza geometrica tra i vettori\n' +
          '- Dot product: prodotto scalare, spesso usato con vettori normalizzati',
      en: 'Embeddings are dense vector representations of data (text, images, audio) in a multi-dimensional space.\n\n' +
          '**Why they matter:**\n' +
          '- They capture the semantic meaning of content\n' +
          '- Enable similarity-based comparisons instead of exact keyword matching\n' +
          '- Foundation for semantic search and RAG\n\n' +
          '**OpenAI Models:**\n' +
          '- text-embedding-ada-002: legacy model, 1536 dimensions\n' +
          '- text-embedding-3-small: faster and cheaper\n' +
          '- text-embedding-3-large: superior quality, 3072 dimensions\n\n' +
          '**Similarity Metrics:**\n' +
          '- Cosine similarity: measures the angle between two vectors, useful for direction comparison\n' +
          '- Euclidean distance: measures geometric distance between vectors\n' +
          '- Dot product: scalar product, often used with normalized vectors'
    },
    keyPoints: {
      it: [
        'Gli embeddings trasformano contenuto in vettori numerici',
        'OpenAI offre diversi modelli di embedding con trade-off costo/prestazioni',
        'La cosine similarity e la metrica piu usata per la ricerca semantica',
        'Vettori simili nello spazio semantico hanno significati simili',
        'La dimensione del vettore influenza precisione e occupazione di memoria'
      ],
      en: [
        'Embeddings transform content into numerical vectors',
        'OpenAI offers various embedding models with cost/performance trade-offs',
        'Cosine similarity is the most common metric for semantic search',
        'Semantically similar vectors are close in vector space',
        'Vector dimension affects precision and memory usage'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: '$response = $client->embeddings()->create([\n' +
              '    \'model\' => \'text-embedding-3-small\',\n' +
              '    \'input\' => \'Hello world\',\n' +
              ']);\n' +
              '$embedding = $response->embeddings[0]->embedding;',
        explanation: 'Generate an embedding vector using the OpenAI PHP SDK'
      },
      {
        language: 'php',
        code: 'function cosineSimilarity(array $a, array $b): float {\n' +
              '    $dot = array_sum(array_map(fn($x, $y) => $x * $y, $a, $b));\n' +
              '    $normA = sqrt(array_sum(array_map(fn($x) => $x * $x, $a)));\n' +
              '    $normB = sqrt(array_sum(array_map(fn($x) => $x * $x, $b)));\n' +
              '    return $dot / ($normA * $normB);\n' +
              '}',
        explanation: 'Calculate cosine similarity between two embedding vectors'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'embeddings-chromadb-2',
    title: {
      it: 'ChromaDB e Ricerca Semantica',
      en: 'ChromaDB and Semantic Search'
    },
    content: {
      it: 'ChromaDB e un database vettoriale open-source progettato per memorizzare e interrogare embeddings ad alte prestazioni.\n\n' +
          '**Concetti chiave:**\n' +
          '- Collection: equivalente di una tabella, contiene documenti, embeddings e metadati\n' +
          '- Document: il contenuto testuale originale\n' +
          '- Embedding: la rappresentazione vettoriale del documento\n' +
          '- Metadata: informazioni aggiuntive associate al documento\n\n' +
          '**Setup:**\n' +
          '- Installazione via pip: pip install chromadb\n' +
          '- Avvio server locale o connessione a istanza cloud\n' +
          '- Client PHP disponibile via HTTP API\n\n' +
          '**Query:**\n' +
          '- query_embeddings: cerca per similarita vettoriale\n' +
          '- where: filtra per metadati prima della ricerca\n' +
          '- n_results: numero di risultati da restituire\n\n' +
          '**Caso d\'uso PHP:**\n' +
          '1. Generare embedding della query utente\n' +
          '2. Inviare embedding a ChromaDB via API REST\n' +
          '3. Ricevere i documenti piu simili con punteggio di distanza',
      en: 'ChromaDB is an open-source vector database designed for high-performance embedding storage and querying.\n\n' +
          '**Key Concepts:**\n' +
          '- Collection: equivalent to a table, holds documents, embeddings, and metadata\n' +
          '- Document: the original text content\n' +
          '- Embedding: the vector representation of the document\n' +
          '- Metadata: additional information attached to the document\n\n' +
          '**Setup:**\n' +
          '- Install via pip: pip install chromadb\n' +
          '- Start local server or connect to cloud instance\n' +
          '- PHP client available via HTTP API\n\n' +
          '**Querying:**\n' +
          '- query_embeddings: search by vector similarity\n' +
          '- where: filter by metadata before searching\n' +
          '- n_results: number of results to return\n\n' +
          '**PHP Use Case:**\n' +
          '1. Generate embedding for the user query\n' +
          '2. Send embedding to ChromaDB via REST API\n' +
          '3. Receive most similar documents with distance score'
    },
    keyPoints: {
      it: [
        'ChromaDB e un database vettoriale leggero e open-source',
        'Le collections raggruppano documenti, embeddings e metadati',
        'La ricerca per similarita restituisce i vettori piu vicini',
        'I metadati permettono di filtrare i risultati prima della ricerca vettoriale',
        'L\'integrazione PHP avviene tipicamente tramite API REST'
      ],
      en: [
        'ChromaDB is a lightweight open-source vector database',
        'Collections group documents, embeddings, and metadata',
        'Similarity search returns the nearest vectors',
        'Metadata allows filtering results before vector search',
        'PHP integration typically happens via REST API'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: '$http = new GuzzleHttp\\Client();\n' +
              '$response = $http->post(\'http://localhost:8000/api/v1/collections/docs/query\', [\n' +
              '    \'json\' => [\n' +
              '        \'query_embeddings\' => [$queryEmbedding],\n' +
              '        \'n_results\' => 5,\n' +
              '        \'where\' => [\'category\' => \'tutorial\'],\n' +
              '    ],\n' +
              ']);',
        explanation: 'Query a ChromaDB collection from PHP using the REST API'
      }
    ],
    estimatedMinutes: 20
  }
];

const embeddingsChromadbActivities: PracticalActivity[] = [
  {
    id: 'embeddings-chromadb-activity-1',
    title: {
      it: 'Costruire un motore di ricerca semantica',
      en: 'Build a semantic search engine'
    },
    description: {
      it: 'Crea un motore di ricerca semantica che indicizza una serie di articoli tecnici e permette agli utenti di cercare per significato anziche per keyword esatte.\n\n' +
          'Il progetto includera la generazione di embeddings, l\'inserimento in ChromaDB e un endpoint PHP per le query.',
      en: 'Create a semantic search engine that indexes a set of technical articles and allows users to search by meaning rather than exact keywords.\n\n' +
          'The project will include embedding generation, insertion into ChromaDB, and a PHP endpoint for queries.'
    },
    tasks: {
      it: [
        'Prepara un dataset di almeno 20 articoli tecnici con titolo, contenuto e categoria',
        'Genera gli embeddings per ogni articolo usando OpenAI e memorizzali in un file JSON',
        'Crea una collection ChromaDB e inserisci i documenti con i relativi embeddings e metadati',
        'Implementa un endpoint PHP che riceve una query testuale, la trasforma in embedding e interroga ChromaDB',
        'Visualizza i risultati ordinati per similarita, mostrando titolo, snippet e punteggio'
      ],
      en: [
        'Prepare a dataset of at least 20 technical articles with title, content, and category',
        'Generate embeddings for each article using OpenAI and store them in a JSON file',
        'Create a ChromaDB collection and insert documents with their embeddings and metadata',
        'Implement a PHP endpoint that receives a text query, converts it to an embedding, and queries ChromaDB',
        'Display results sorted by similarity, showing title, snippet, and score'
      ]
    },
    successCriteria: {
      it: [
        'Il dataset contiene almeno 20 articoli con metadati completi',
        'Gli embeddings sono stati generati e salvati correttamente',
        'La collection ChromaDB e popolata e interrogabile',
        'L\'endpoint PHP restituisce risultati rilevanti per query semantiche',
        'I risultati includono metadati e punteggio di similarita'
      ],
      en: [
        'The dataset contains at least 20 articles with complete metadata',
        'Embeddings are generated and saved correctly',
        'The ChromaDB collection is populated and queryable',
        'The PHP endpoint returns relevant results for semantic queries',
        'Results include metadata and similarity score'
      ]
    },
    hints: {
      it: [
        'Usa text-embedding-3-small per bilanciare costo e qualita durante lo sviluppo',
        'Aggiungi un campo source ai metadati per tracciare l\'origine di ogni articolo',
        'Implementa un caching locale degli embeddings per evitare chiamate ripetute alla API'
      ],
      en: [
        'Use text-embedding-3-small to balance cost and quality during development',
        'Add a source field to metadata to track the origin of each article',
        'Implement local embedding caching to avoid repeated API calls'
      ]
    },
    estimatedMinutes: 90
  }
];

const mcpToolCallingLessons: TheoryLesson[] = [
  {
    id: 'mcp-tool-calling-1',
    title: {
      it: 'Architettura MCP e Definizione dei Tool',
      en: 'MCP Architecture and Tool Definitions'
    },
    content: {
      it: 'Il Model Context Protocol (MCP) e uno standard aperto per collegare modelli AI a fonti di dati e strumenti esterni.\n\n' +
          '**Architettura:**\n' +
          '- Host: l\'applicazione che ospita il modello (es. IDE, chatbot)\n' +
          '- Client: componente nel host che gestisce la connessione al server MCP\n' +
          '- Server: processo esterno che espone tools, resources e prompts\n\n' +
          '**Definizione di un tool:**\n' +
          '- name: identificatore univoco del tool\n' +
          '- description: spiegazione per il modello di cosa fa il tool\n' +
          '- inputSchema: schema JSON che descrive i parametri richiesti\n\n' +
          '**Flusso di esecuzione:**\n' +
          '1. Il modello riceve la lista dei tool disponibili\n' +
          '2. Decide se e quale tool invocare in base alla richiesta\n' +
          '3. Il client esegue il tool e restituisce il risultato al modello\n' +
          '4. Il modello genera la risposta finale usando il risultato',
      en: 'The Model Context Protocol (MCP) is an open standard for connecting AI models to external data sources and tools.\n\n' +
          '**Architecture:**\n' +
          '- Host: the application running the model (e.g., IDE, chatbot)\n' +
          '- Client: component in the host that manages the MCP server connection\n' +
          '- Server: external process that exposes tools, resources, and prompts\n\n' +
          '**Tool Definition:**\n' +
          '- name: unique identifier for the tool\n' +
          '- description: explanation for the model of what the tool does\n' +
          '- inputSchema: JSON schema describing required parameters\n\n' +
          '**Execution Flow:**\n' +
          '1. The model receives the list of available tools\n' +
          '2. Decides whether and which tool to invoke based on the request\n' +
          '3. The client executes the tool and returns the result to the model\n' +
          '4. The model generates the final response using the result'
    },
    keyPoints: {
      it: [
        'MCP standardizza la comunicazione tra modelli AI e tool esterni',
        'Ogni tool deve avere una descrizione chiara per guidare il modello',
        'Lo schema di input definisce i parametri e i loro tipi',
        'L\'host coordina il client e il server MCP',
        'Il modello decide autonomamente quando invocare un tool'
      ],
      en: [
        'MCP standardizes communication between AI models and external tools',
        'Each tool must have a clear description to guide the model',
        'The input schema defines parameters and their types',
        'The host coordinates the MCP client and server',
        'The model autonomously decides when to invoke a tool'
      ]
    },
    codeExamples: [
      {
        language: 'json',
        code: '{\n' +
              '  "name": "get_weather",\n' +
              '  "description": "Get current weather for a city",\n' +
              '  "inputSchema": {\n' +
              '    "type": "object",\n' +
              '    "properties": {\n' +
              '      "city": { "type": "string" },\n' +
              '      "units": { "type": "string", "enum": ["metric", "imperial"] }\n' +
              '    },\n' +
              '    "required": ["city"]\n' +
              '  }\n' +
              '}',
        explanation: 'Example MCP tool definition with name, description, and input schema'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'mcp-tool-calling-2',
    title: {
      it: 'Function Calling e Integrazione API',
      en: 'Function Calling and API Integration'
    },
    content: {
      it: 'Il function calling di OpenAI permette ai modelli GPT di invocare funzioni definite dallo sviluppatore durante una conversazione.\n\n' +
          '**Implementazione:**\n' +
          '- Definire le funzioni nel parametro tools della chiamata API\n' +
          '- Ogni funzione ha nome, descrizione e parametri in formato JSON Schema\n' +
          '- Il modello puo restituire una function_call anziche un testo\n\n' +
          '**Gestione della risposta:**\n' +
          '- Se finish_reason == \'tool_calls\', il modello ha richiesto un tool\n' +
          '- Estrarre name e arguments dalla risposta\n' +
          '- Eseguire la funzione nel codice applicativo\n' +
          '- Inviare il risultato come messaggio di tipo tool nella conversazione\n\n' +
          '**Integrazione API esterne:**\n' +
          '- Wrappare chiamate HTTP come funzioni invocabili\n' +
          '- Validare gli argomenti prima dell\'esecuzione\n' +
          '- Gestire errori e timeout per non bloccare la conversazione\n' +
          '- Limitare i tool disponibili in base al contesto per ridurre allucinazioni',
      en: 'OpenAI function calling allows GPT models to invoke developer-defined functions during a conversation.\n\n' +
          '**Implementation:**\n' +
          '- Define functions in the tools parameter of the API call\n' +
          '- Each function has a name, description, and parameters in JSON Schema format\n' +
          '- The model may return a function_call instead of text\n\n' +
          '**Handling the Response:**\n' +
          '- If finish_reason == \'tool_calls\', the model requested a tool\n' +
          '- Extract name and arguments from the response\n' +
          '- Execute the function in application code\n' +
          '- Send the result back as a tool message in the conversation\n\n' +
          '**External API Integration:**\n' +
          '- Wrap HTTP calls as invocable functions\n' +
          '- Validate arguments before execution\n' +
          '- Handle errors and timeouts to avoid blocking the conversation\n' +
          '- Limit available tools based on context to reduce hallucinations'
    },
    keyPoints: {
      it: [
        'Il function calling estende le capacita del modello con codice applicativo',
        'Le funzioni sono descritte tramite JSON Schema per il modello',
        'Il flusso conversazione richiede almeno due chiamate API: una per il tool, una per la risposta',
        'Le API esterne vanno wrappate in funzioni type-safe',
        'La validazione degli input e essenziale per la sicurezza'
      ],
      en: [
        'Function calling extends model capabilities with application code',
        'Functions are described via JSON Schema for the model',
        'The conversation flow requires at least two API calls: one for the tool, one for the response',
        'External APIs should be wrapped in type-safe functions',
        'Input validation is essential for security'
      ]
    },
    codeExamples: [
      {
        language: 'php',
        code: '$response = $client->chat()->create([\n' +
              '    \'model\' => \'gpt-4o\',\n' +
              '    \'messages\' => $messages,\n' +
              '    \'tools\' => [[\n' +
              '        \'type\' => \'function\',\n' +
              '        \'function\' => [\n' +
              '            \'name\' => \'get_weather\',\n' +
              '            \'parameters\' => $weatherSchema\n' +
              '        ]\n' +
              '    ]],\n' +
              ']);',
        explanation: 'Passing available tools to an OpenAI chat completion request'
      }
    ],
    estimatedMinutes: 20
  }
];

const mcpToolCallingActivities: PracticalActivity[] = [
  {
    id: 'mcp-tool-calling-activity-1',
    title: {
      it: 'Costruire un agente con tool custom',
      en: 'Build an agent with custom tools'
    },
    description: {
      it: 'Sviluppa un agente conversazionale in grado di rispondere a domande sui prezzi di criptovalute e sul meteo utilizzando tool custom integrati tramite function calling.\n\n' +
          'L\'agente dovra gestire il flusso conversazione, invocare i tool al momento giusto e presentare i risultati in modo naturale.',
      en: 'Develop a conversational agent capable of answering questions about cryptocurrency prices and weather using custom tools integrated via function calling.\n\n' +
          'The agent must handle the conversation flow, invoke tools at the right time, and present results naturally.'
    },
    tasks: {
      it: [
        'Definisci almeno due tool: uno per il prezzo di una criptovaluta (es. CoinGecko API) e uno per il meteo (es. OpenWeatherMap)',
        'Crea uno script PHP che prepara la lista dei tool in formato JSON Schema',
        'Implementa il loop conversazionale: ricevi input utente, chiama OpenAI, gestisci tool calls se presenti',
        'Esegui i tool richiesti e reinserisci i risultati nella conversazione come messaggi di tipo tool',
        'Aggiungi un controllo per evitare loop infiniti di tool calling (max 5 iterazioni)'
      ],
      en: [
        'Define at least two tools: one for cryptocurrency prices (e.g., CoinGecko API) and one for weather (e.g., OpenWeatherMap)',
        'Create a PHP script that prepares the tool list in JSON Schema format',
        'Implement the conversation loop: receive user input, call OpenAI, handle tool calls if present',
        'Execute requested tools and feed results back into the conversation as tool messages',
        'Add a check to prevent infinite tool calling loops (max 5 iterations)'
      ]
    },
    successCriteria: {
      it: [
        'I tool sono definiti con nome, descrizione e schema parametri corretti',
        'L\'agente riconosce correttamente quando invocare un tool',
        'I risultati dei tool vengono integrati nella risposta finale',
        'Il loop gestisce errori di API esterne senza crashare',
        'E presente un limite al numero di iterazioni di tool calling'
      ],
      en: [
        'Tools are defined with correct name, description, and parameter schema',
        'The agent correctly recognizes when to invoke a tool',
        'Tool results are integrated into the final response',
        'The loop handles external API errors without crashing',
        'There is a limit on the number of tool calling iterations'
      ]
    },
    hints: {
      it: [
        'Inizia con un solo tool per testare il flusso, poi aggiungi il secondo',
        'Usa file_put_contents per loggare ogni passaggio del loop e debuggare piu facilmente',
        'Aggiungi una descrizione molto specifica ai tool per ridurre allucinazioni del modello'
      ],
      en: [
        'Start with a single tool to test the flow, then add the second one',
        'Use file_put_contents to log each loop step for easier debugging',
        'Add very specific descriptions to tools to reduce model hallucinations'
      ]
    },
    estimatedMinutes: 90
  }
];

const typescriptLessons: TheoryLesson[] = [
  {
    id: 'typescript-1',
    title: {
      it: 'TypeScript vs JavaScript e Tipi Base',
      en: 'TypeScript vs JavaScript and Basic Types'
    },
    content: {
      it: 'TypeScript e un superset tipizzato di JavaScript che aggiunge controllo statico dei tipi e funzionalita avanzate al linguaggio.\n\n' +
          '**Vantaggi principali:**\n' +
          '- Rilevamento di errori a compile-time anziche a runtime\n' +
          '- Autocompletamento e navigazione del codice migliorati\n' +
          '- Documentazione implicita attraverso i tipi\n' +
          '- Refactoring piu sicuro su codebase grandi\n\n' +
          '**Tipi base:**\n' +
          '- string, number, boolean: tipi primitivi\n' +
          '- array: number[] oppure Array<number>\n' +
          '- tuple: [string, number] per array con lunghezza e tipi fissi\n' +
          '- any: disabilita il controllo dei tipi (da evitare)\n' +
          '- unknown: tipo sicuro alternativo a any, richiede narrowing\n\n' +
          '**Inferenza:**\n' +
          'TypeScript puo inferire automaticamente il tipo da un valore iniziale,\n' +
          'ma e buona pratica annotare esplicitamente i parametri di funzione e i return type.',
      en: 'TypeScript is a typed superset of JavaScript that adds static type checking and advanced features to the language.\n\n' +
          '**Main Benefits:**\n' +
          '- Error detection at compile-time rather than runtime\n' +
          '- Improved autocompletion and code navigation\n' +
          '- Implicit documentation through types\n' +
          '- Safer refactoring on large codebases\n\n' +
          '**Basic Types:**\n' +
          '- string, number, boolean: primitive types\n' +
          '- array: number[] or Array<number>\n' +
          '- tuple: [string, number] for arrays with fixed length and types\n' +
          '- any: disables type checking (avoid when possible)\n' +
          '- unknown: safe alternative to any, requires narrowing\n\n' +
          '**Inference:**\n' +
          'TypeScript can automatically infer the type from an initial value,\n' +
          'but it is good practice to explicitly annotate function parameters and return types.'
    },
    keyPoints: {
      it: [
        'TypeScript aggiunge tipi statici a JavaScript',
        'I tipi primitivi sono string, number e boolean',
        'Le tuple definiscono array con tipi e lunghezza fissi',
        'any disabilita il type checking, unknown e la scelta sicura',
        'L\'inferenza riduce la verbosita ma le annotazioni esplicite aumentano la chiarezza'
      ],
      en: [
        'TypeScript adds static types to JavaScript',
        'Primitive types are string, number, and boolean',
        'Tuples define arrays with fixed types and length',
        'any disables type checking, unknown is the safe choice',
        'Inference reduces verbosity but explicit annotations improve clarity'
      ]
    },
    codeExamples: [
      {
        language: 'typescript',
        code: 'let username: string = \'Mario\';\n' +
              'let age: number = 30;\n' +
              'let isActive: boolean = true;\n' +
              'let scores: number[] = [10, 20, 30];\n' +
              'let person: [string, number] = [\'Mario\', 30];',
        explanation: 'Declaring basic types and a tuple in TypeScript'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'typescript-2',
    title: {
      it: 'Interfacce, Generics e Type Narrowing',
      en: 'Interfaces, Generics, and Type Narrowing'
    },
    content: {
      it: 'TypeScript offre strumenti avanzati per modellare dati complessi e scrivere codice riutilizzabile.\n\n' +
          '**Interfacce e type aliases:**\n' +
          '- interface definisce la forma di un oggetto ed e estendibile\n' +
          '- type crea un alias per un tipo e supporta unioni e intersezioni\n' +
          '- Entrambi possono descrivere oggetti, ma interface supporta la dichiarazione mergiata\n\n' +
          '**Generics:**\n' +
          '- Permettono di scrivere funzioni e classi riutilizzabili mantenendo il type safety\n' +
          '- La sintassi usa <T> come placeholder per il tipo\n' +
          '- E possibile vincolare un generic con extends\n\n' +
          '**Union e intersection:**\n' +
          '- Union (A | B): un valore puo essere di tipo A o B\n' +
          '- Intersection (A & B): un valore deve soddisfare entrambi i tipi\n\n' +
          '**Type narrowing:**\n' +
          '- typeof: restringe il tipo in base al tipo primitivo\n' +
          '- instanceof: restringe in base alla classe di appartenenza\n' +
          '- in: verifica la presenza di una proprieta in un oggetto\n' +
          '- Type guards: funzioni che restituiscono un booleano e restringono il tipo',
      en: 'TypeScript provides advanced tools for modeling complex data and writing reusable code.\n\n' +
          '**Interfaces and Type Aliases:**\n' +
          '- interface defines the shape of an object and is extendable\n' +
          '- type creates an alias for a type and supports unions and intersections\n' +
          '- Both can describe objects, but interface supports declaration merging\n\n' +
          '**Generics:**\n' +
          '- Allow writing reusable functions and classes while maintaining type safety\n' +
          '- Syntax uses <T> as a placeholder for the type\n' +
          '- Generics can be constrained with extends\n\n' +
          '**Union and Intersection:**\n' +
          '- Union (A | B): a value can be type A or B\n' +
          '- Intersection (A & B): a value must satisfy both types\n\n' +
          '**Type Narrowing:**\n' +
          '- typeof: narrows the type based on primitive type\n' +
          '- instanceof: narrows based on class membership\n' +
          '- in: checks for the presence of a property in an object\n' +
          '- Type guards: functions that return a boolean and narrow the type'
    },
    keyPoints: {
      it: [
        'Le interface sono estendibili e supportano il declaration merging',
        'I type aliases sono piu flessibili per unioni e tipi complessi',
        'I generics rendono il codice riutilizzabile senza perdere i tipi',
        'Le unioni permettono valori alternativi, le intersezioni combinano vincoli',
        'Il type narrowing converte un tipo ampio in uno piu specifico in modo sicuro'
      ],
      en: [
        'Interfaces are extendable and support declaration merging',
        'Type aliases are more flexible for unions and complex types',
        'Generics make code reusable without losing type information',
        'Unions allow alternative values, intersections combine constraints',
        'Type narrowing safely converts a broad type into a more specific one'
      ]
    },
    codeExamples: [
      {
        language: 'typescript',
        code: 'interface User {\n' +
              '    id: number;\n' +
              '    name: string;\n' +
              '}\n' +
              'type Admin = User & { role: \'admin\' };\n' +
              'function identity<T>(arg: T): T {\n' +
              '    return arg;\n' +
              '}',
        explanation: 'Interface, intersection type, and a generic function in TypeScript'
      }
    ],
    estimatedMinutes: 20
  }
];

const typescriptActivities: PracticalActivity[] = [
  {
    id: 'typescript-activity-1',
    title: {
      it: 'Refactoring di un progetto JavaScript in TypeScript',
      en: 'Refactoring a JavaScript project to TypeScript'
    },
    description: {
      it: 'Prendi un piccolo progetto JavaScript esistente (es. una lista di task o un gestionale semplice) e convertilo in TypeScript.\n\n' +
          'Obiettivo: configurare tsconfig.json, tipizzare modelli e funzioni, e attivare la modalita strict per massimizzare i benefici del type checking.',
      en: 'Take a small existing JavaScript project (e.g., a task list or simple management app) and convert it to TypeScript.\n\n' +
          'Goal: configure tsconfig.json, type models and functions, and enable strict mode to maximize the benefits of type checking.'
    },
    tasks: {
      it: [
        'Inizializza TypeScript nel progetto con npm install typescript e crea tsconfig.json',
        'Configura strict: true, noImplicitAny: true e esModuleInterop: true in tsconfig.json',
        'Definisci le interface per i modelli principali del progetto (es. Task, User, Project)',
        'Tipizza tutte le funzioni specificando i tipi dei parametri e il tipo di ritorno',
        'Risolvi tutti gli errori di compilazione introducendo tipi appropriati e type guards dove necessario'
      ],
      en: [
        'Initialize TypeScript in the project with npm install typescript and create tsconfig.json',
        'Configure strict: true, noImplicitAny: true, and esModuleInterop: true in tsconfig.json',
        'Define interfaces for the main project models (e.g., Task, User, Project)',
        'Type all functions by specifying parameter types and return types',
        'Resolve all compilation errors by introducing appropriate types and type guards where needed'
      ]
    },
    successCriteria: {
      it: [
        'Il progetto compila senza errori con tsc --noEmit',
        'tsconfig.json ha strict: true attivo',
        'Ogni funzione ha annotazioni di tipo per parametri e ritorno',
        'I modelli dati sono descritti tramite interface o type aliases',
        'Non ci sono variabili implicitamente di tipo any'
      ],
      en: [
        'The project compiles without errors using tsc --noEmit',
        'tsconfig.json has strict: true enabled',
        'Every function has type annotations for parameters and return value',
        'Data models are described via interfaces or type aliases',
        'There are no implicitly typed any variables'
      ]
    },
    hints: {
      it: [
        'Inizia tipizzando i modelli dati: definire le interface aiuta a capire la struttura del progetto',
        'Usa unknown invece di any quando non conosci il tipo esatto',
        'Il flag strict: true abilita tutte le opzioni di controllo rigoroso in un colpo solo'
      ],
      en: [
        'Start by typing data models: defining interfaces helps understand the project structure',
        'Use unknown instead of any when you do not know the exact type',
        'The strict: true flag enables all strict checking options at once'
      ]
    },
    estimatedMinutes: 90
  }
];


const laravel11Lessons = [
  {
    id: 'laravel11-1',
    title: { it: 'Struttura Semplificata e Configurazione', en: 'Slimmed Structure and Configuration' },
    content: {
      it: 'Laravel 11 introduce una struttura applicativa semplificata e una configurazione ottimizzata.\n\n' +
          '**Principali novita:**\n' +
          '- Slimmed application structure con meno file di default\n' +
          '- Database di default passato a SQLite\n' +
          '- Configurazione piu snella e centralizzata\n' +
          '- API e Broadcasting ora opzionali\n',
      en: 'Laravel 11 introduces a slimmed application structure and optimized configuration.\n\n' +
          '**Key changes:**\n' +
          '- Slimmed application structure with fewer default files\n' +
          '- Default database switched to SQLite\n' +
          '- Leaner, more centralized configuration\n' +
          '- API and Broadcasting are now optional\n',
    },
    keyPoints: {
      it: ['Struttura semplificata', 'SQLite di default', 'Configurazione minimalista', 'Stub personalizzabili', 'Avvio piu veloce'],
      en: ['Slimmed structure', 'SQLite by default', 'Minimalist configuration', 'Customizable stubs', 'Faster bootstrapping'],
    },
    codeExamples: [
      {
        language: 'php',
        code: 'php artisan install:api\n' +
              'php artisan install:broadcasting',
        explanation: 'Install optional Laravel features'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'laravel11-2',
    title: { it: 'Funzionalita Avanzate di Laravel 11', en: 'Laravel 11 Advanced Features' },
    content: {
      it: 'Laravel 11 aggiunge funzionalita avanzate per monitoraggio, sicurezza e interattivita.\n\n' +
          '**Novita:**\n' +
          '- Health routes integrate per il monitoring\n' +
          '- Rate limiting al secondo\n' +
          '- Graceful encryption key rotation\n' +
          '- Laravel Prompts per CLI interattive\n' +
          '- Laravel Reverb per applicazioni real-time\n',
      en: 'Laravel 11 adds advanced features for monitoring, security, and interactivity.\n\n' +
          '**Features:**\n' +
          '- Integrated health routes for monitoring\n' +
          '- Per-second rate limiting\n' +
          '- Graceful encryption key rotation\n' +
          '- Laravel Prompts for interactive CLI\n' +
          '- Laravel Reverb for real-time applications\n',
    },
    keyPoints: {
      it: ['Health route /up', 'Rate limiting per secondo', 'Rotazione chiavi senza downtime', 'Prompts validation', 'Reverb real-time'],
      en: ['Health route /up', 'Per-second rate limiting', 'Key rotation without downtime', 'Prompts validation', 'Reverb real-time'],
    },
    codeExamples: [
      {
        language: 'php',
        code: 'Route::get(\'/up\', function () {\n' +
              '    return [\'status\' => \'ok\'];\n' +
              '});',
        explanation: 'Basic health route'
      },
      {
        language: 'php',
        code: 'RateLimiter::for(\'api\', function (Request $request) {\n' +
              '    return Limit::perSecond(5);\n' +
              '});',
        explanation: 'Per-second rate limiting'
      }
    ],
    estimatedMinutes: 20
  }
];

const laravel11Activities = [
  {
    id: 'laravel11-activity-1',
    title: { it: 'Progetto Laravel 11 con Novita', en: 'Laravel 11 New Features Project' },
    description: {
      it: 'Crea una nuova applicazione Laravel 11 sfruttando la struttura semplificata e le funzionalita avanzate.\n\n' +
          'Obiettivo: familiarizzare con le novita introdotte.',
      en: 'Create a new Laravel 11 application leveraging the slimmed structure and advanced features.\n\n' +
          'Goal: get familiar with the newly introduced features.',
    },
    tasks: {
      it: [
        'Crea un nuovo progetto Laravel 11',
        'Configura SQLite come database di default',
        'Aggiungi una health route personalizzata',
        'Implementa rate limiting per secondo su un gruppo di route API',
        'Crea un comando Artisan con Laravel Prompts e validation'
      ],
      en: [
        'Create a new Laravel 11 project',
        'Configure SQLite as the default database',
        'Add a custom health route',
        'Implement per-second rate limiting on an API route group',
        'Create an Artisan command with Laravel Prompts and validation'
      ]
    },
    successCriteria: {
      it: [
        'Progetto installato senza errori',
        'Migrazioni eseguite correttamente su SQLite',
        'Health route restituisce JSON corretto',
        'Rate limiting blocca le richieste oltre il limite',
        'Comando interattivo gestisce input e validation'
      ],
      en: [
        'Project installed without errors',
        'Migrations run successfully on SQLite',
        'Health route returns correct JSON',
        'Rate limiting blocks requests above the limit',
        'Interactive command handles input and validation'
      ]
    },
    hints: {
      it: [
        'Usa php artisan serve per testare in locale',
        'Controlla il file routes/web.php per le route',
        'Consulta la documentazione ufficiale di Laravel 11'
      ],
      en: [
        'Use php artisan serve for local testing',
        'Check the routes/web.php file for routes',
        'Consult the official Laravel 11 documentation'
      ]
    },
    estimatedMinutes: 60
  }
];

const promptEngineeringLessons = [
  {
    id: 'prompt-engineering-1',
    title: { it: 'Tecniche di Prompting', en: 'Prompting Techniques' },
    content: {
      it: 'Il prompt engineering e l\'arte di formulare richieste efficaci per i modelli di linguaggio.\n\n' +
          '**Tecniche fondamentali:**\n' +
          '- Zero-shot vs few-shot prompting\n' +
          '- Chain-of-thought reasoning\n' +
          '- Role prompting per contestualizzare il modello\n',
      en: 'Prompt engineering is the art of crafting effective requests for language models.\n\n' +
          '**Core techniques:**\n' +
          '- Zero-shot vs few-shot prompting\n' +
          '- Chain-of-thought reasoning\n' +
          '- Role prompting to contextualize the model\n',
    },
    keyPoints: {
      it: ['Zero-shot senza esempi', 'Few-shot con esempi concreti', 'Chain-of-thought passo dopo passo', 'Role prompting per contesto', 'Prompt chiari e specifici'],
      en: ['Zero-shot without examples', 'Few-shot with concrete examples', 'Chain-of-thought step by step', 'Role prompting for context', 'Clear and specific prompts'],
    },
    codeExamples: [
      {
        language: 'text',
        code: 'You are an expert PHP developer.\n' +
              'Explain the following code step by step:\n' +
              'function foo() { return 1; }',
        explanation: 'Role prompting with a clear instruction'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'prompt-engineering-2',
    title: { it: 'Output Strutturato e Valutazione', en: 'Structured Output and Evaluation' },
    content: {
      it: 'Ottenere output prevedibili e valutare la qualita dei prompt sono competenze avanzate.\n\n' +
          '**Argomenti trattati:**\n' +
          '- Structured output (JSON mode)\n' +
          '- Prompt templates e variabili\n' +
          '- RAG prompting techniques\n' +
          '- Evaluating prompt quality\n' +
          '- Avoiding hallucinations with constraints\n',
      en: 'Getting predictable outputs and evaluating prompt quality are advanced skills.\n\n' +
          '**Topics covered:**\n' +
          '- Structured output (JSON mode)\n' +
          '- Prompt templates and variables\n' +
          '- RAG prompting techniques\n' +
          '- Evaluating prompt quality\n' +
          '- Avoiding hallucinations with constraints\n',
    },
    keyPoints: {
      it: ['JSON mode per output strutturati', 'Template riutilizzabili', 'RAG con contesto esterno', 'Metriche di valutazione', 'Constraint per ridurre allucinazioni'],
      en: ['JSON mode for structured outputs', 'Reusable templates', 'RAG with external context', 'Evaluation metrics', 'Constraints to reduce hallucinations'],
    },
    codeExamples: [
      {
        language: 'text',
        code: 'Return the result as JSON with keys: name, age, city.\n' +
              'Example: {"name":"Alice","age":25,"city":"Rome"}',
        explanation: 'Prompt for structured JSON output'
      }
    ],
    estimatedMinutes: 20
  }
];

const promptEngineeringActivities = [
  {
    id: 'prompt-engineering-activity-1',
    title: { it: 'Laboratorio di Prompt Engineering', en: 'Prompt Engineering Lab' },
    description: {
      it: 'Progetta e testa un set di prompt per diverse attivita usando le tecniche apprese.\n\n' +
          'Obiettivo: padroneggiare le tecniche di prompting avanzate.',
      en: 'Design and test a set of prompts for different tasks using the learned techniques.\n\n' +
          'Goal: master advanced prompting techniques.',
    },
    tasks: {
      it: [
        'Scrivi un prompt zero-shot e uno few-shot per la stessa task',
        'Crea un prompt chain-of-thought per risolvere un problema logico',
        'Progetta un prompt con role prompting per revisione codice',
        'Definisci un template con variabili per generare documentazione API',
        'Testa un prompt RAG con contesto fornito e valuta le allucinazioni'
      ],
      en: [
        'Write a zero-shot and a few-shot prompt for the same task',
        'Create a chain-of-thought prompt to solve a logic problem',
        'Design a role-prompting prompt for code review',
        'Define a template with variables to generate API documentation',
        'Test a RAG prompt with provided context and evaluate hallucinations'
      ]
    },
    successCriteria: {
      it: [
        'Prompt zero-shot e few-shot confrontati efficacemente',
        'Chain-of-thought produce ragionamento chiaro e verificabile',
        'Role prompting migliora la qualita della risposta',
        'Template funziona con diverse variabili senza errori',
        'RAG riduce allucinazioni rispetto al prompt senza contesto'
      ],
      en: [
        'Zero-shot and few-shot prompts are effectively compared',
        'Chain-of-thought produces clear and verifiable reasoning',
        'Role prompting improves the quality of the response',
        'Template works with different variables without errors',
        'RAG reduces hallucinations compared to a prompt without context'
      ]
    },
    hints: {
      it: [
        'Usa esempi concreti e variati nei few-shot',
        'Dividi il problema in sottopassaggi logici',
        'Specifica sempre il formato di output desiderato'
      ],
      en: [
        'Use concrete and varied examples in few-shot',
        'Break the problem into logical sub-steps',
        'Always specify the desired output format'
      ]
    },
    estimatedMinutes: 60
  }
];

const technicalEnglishLessons = [
  {
    id: 'technical-english-1',
    title: { it: 'Documentazione e Commenti', en: 'Documentation and Comments' },
    content: {
      it: 'L\'inglese tecnico e fondamentale per collaborare efficacemente in team internazionali.\n\n' +
          '**Argomenti:**\n' +
          '- Writing technical documentation\n' +
          '- Code comments and docblocks\n' +
          '- Writing effective commit messages\n' +
          '- Pull request descriptions\n',
      en: 'Technical English is essential for effective collaboration in international teams.\n\n' +
          '**Topics:**\n' +
          '- Writing technical documentation\n' +
          '- Code comments and docblocks\n' +
          '- Writing effective commit messages\n' +
          '- Pull request descriptions\n',
    },
    keyPoints: {
      it: ['Documentazione chiara e concisa', 'Docblocks PHPDoc/JSDoc', 'Commit messages descrittivi', 'PR con contesto e motivazione', 'Usa il presente imperativo'],
      en: ['Clear and concise documentation', 'PHPDoc/JSDoc docblocks', 'Descriptive commit messages', 'PR with context and motivation', 'Use present imperative tense'],
    },
    codeExamples: [
      {
        language: 'php',
        code: '/**\n' +
              ' * Calculate the total price.\n' +
              ' *\n' +
              ' * @param float $price\n' +
              ' * @param int $quantity\n' +
              ' * @return float\n' +
              ' */\n' +
              'function total(float $price, int $quantity): float {\n' +
              '    return $price * $quantity;\n' +
              '}',
        explanation: 'Clear PHPDoc docblock example'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'technical-english-2',
    title: { it: 'API Doc e Comunicazione Professionale', en: 'API Docs and Professional Communication' },
    content: {
      it: 'Documentare API e comunicare in modo professionale sono competenze chiave per ogni sviluppatore.\n\n' +
          '**Argomenti:**\n' +
          '- API documentation best practices\n' +
          '- Professional email communication\n' +
          '- Common technical vocabulary for developers\n',
      en: 'Documenting APIs and communicating professionally are key skills for every developer.\n\n' +
          '**Topics:**\n' +
          '- API documentation best practices\n' +
          '- Professional email communication\n' +
          '- Common technical vocabulary for developers\n',
    },
    keyPoints: {
      it: ['OpenAPI/Swagger per API', 'Endpoint, request, response', 'Email professionali concise', 'Vocabolario tecnico comune', 'Evita gergo ambiguo'],
      en: ['OpenAPI/Swagger for APIs', 'Endpoint, request, response', 'Concise professional emails', 'Common technical vocabulary', 'Avoid ambiguous jargon'],
    },
    codeExamples: [
      {
        language: 'yaml',
        code: 'paths:\n' +
              '  /users:\n' +
              '    get:\n' +
              '      summary: List users\n' +
              '      responses:\n' +
              '        200:\n' +
              '          description: OK',
        explanation: 'OpenAPI YAML snippet'
      }
    ],
    estimatedMinutes: 15
  }
];

const technicalEnglishActivities = [
  {
    id: 'technical-english-activity-1',
    title: { it: 'Scrittura Tecnica Pratica', en: 'Technical Writing Practice' },
    description: {
      it: 'Scegli un piccolo progetto o libreria e produci tutta la documentazione tecnica in inglese.\n\n' +
          'Obiettivo: esercitarsi con l\'inglese tecnico in contesti reali.',
      en: 'Choose a small project or library and produce all technical documentation in English.\n\n' +
          'Goal: practice technical English in real-world contexts.',
    },
    tasks: {
      it: [
        'Scrivi un README professionale in inglese con installazione e uso',
        'Aggiungi docblocks a tutte le funzioni principali del progetto',
        'Crea una serie di commit messages descrittivi seguendo le convenzioni',
        'Redigi una pull request description dettagliata con checklist',
        'Documenta un endpoint API in formato OpenAPI con esempi'
      ],
      en: [
        'Write a professional README in English with installation and usage',
        'Add docblocks to all main functions of the project',
        'Create a series of descriptive commit messages following conventions',
        'Draft a detailed pull request description with a checklist',
        'Document an API endpoint in OpenAPI format with examples'
      ]
    },
    successCriteria: {
      it: [
        'README chiaro, completo e formattato correttamente',
        'Docblocks seguono standard PHPDoc/JSDoc',
        'Commit messages seguono convenzioni (imperativo, brevi)',
        'PR description ha contesto, motivazione e checklist',
        'Documentazione API valida e leggibile'
      ],
      en: [
        'README is clear, complete, and correctly formatted',
        'Docblocks follow PHPDoc/JSDoc standards',
        'Commit messages follow conventions (imperative, concise)',
        'PR description has context, motivation, and checklist',
        'API documentation is valid and readable'
      ]
    },
    hints: {
      it: [
        'Usa un template standard per il README',
        'Descrivi il perche nei commit, non solo il cosa',
        'Rileggi tutto per errori di battitura e chiarezza'
      ],
      en: [
        'Use a standard template for the README',
        'Describe the why in commits, not just the what',
        'Proofread everything for typos and clarity'
      ]
    },
    estimatedMinutes: 60
  }
];

const githubPortfolioLessons = [
  {
    id: 'github-portfolio-1',
    title: { it: 'Profilo GitHub Professionale', en: 'Professional GitHub Profile' },
    content: {
      it: 'GitHub e il curriculum vitae visibile di ogni sviluppatore.\n\n' +
          '**Argomenti:**\n' +
          '- Creating a professional GitHub profile\n' +
          '- README best practices\n' +
          '- Contributing to open source\n',
      en: 'GitHub is the visible resume of every developer.\n\n' +
          '**Topics:**\n' +
          '- Creating a professional GitHub profile\n' +
          '- README best practices\n' +
          '- Contributing to open source\n',
    },
    keyPoints: {
      it: ['Foto e bio professionali', 'README del profilo personalizzato', 'Pinned repositories strategici', 'Contributi open source visibili', 'Codice di condotta e licenze'],
      en: ['Professional photo and bio', 'Custom profile README', 'Strategic pinned repositories', 'Visible open source contributions', 'Code of conduct and licenses'],
    },
    codeExamples: [
      {
        language: 'markdown',
        code: '## Hi, I\'m Mario\n' +
              '\n' +
              '- PHP & Laravel developer\n' +
              '- Open source contributor\n' +
              '- [LinkedIn](https://linkedin.com/in/mario)',
        explanation: 'Example profile README snippet'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'github-portfolio-2',
    title: { it: 'Portfolio e Automazione GitHub', en: 'Portfolio and GitHub Automation' },
    content: {
      it: 'Mostrare le proprie competenze attraverso repository ben curati e automazioni.\n\n' +
          '**Argomenti:**\n' +
          '- Code review etiquette\n' +
          '- Portfolio project ideas\n' +
          '- Showcasing skills through repositories\n' +
          '- GitHub Actions for portfolio automation\n',
      en: 'Showcasing your skills through well-maintained repositories and automation.\n\n' +
          '**Topics:**\n' +
          '- Code review etiquette\n' +
          '- Portfolio project ideas\n' +
          '- Showcasing skills through repositories\n' +
          '- GitHub Actions for portfolio automation\n',
    },
    keyPoints: {
      it: ['Etiquette nelle code review', 'Progetti portfolio realistici', 'README per ogni repository', 'GitHub Actions per CI/CD', 'Profilo aggiornato regolarmente'],
      en: ['Code review etiquette', 'Realistic portfolio projects', 'README for every repository', 'GitHub Actions for CI/CD', 'Keep profile regularly updated'],
    },
    codeExamples: [
      {
        language: 'yaml',
        code: 'name: CI\n' +
              'on: [push]\n' +
              'jobs:\n' +
              '  test:\n' +
              '    runs-on: ubuntu-latest\n' +
              '    steps:\n' +
              '      - uses: actions/checkout@v4',
        explanation: 'Basic GitHub Actions workflow'
      }
    ],
    estimatedMinutes: 20
  }
];

const githubPortfolioActivities = [
  {
    id: 'github-portfolio-activity-1',
    title: { it: 'Revisione Portfolio GitHub', en: 'GitHub Portfolio Review' },
    description: {
      it: 'Crea o migliora il tuo portfolio GitHub professionale per presentarti al meglio.\n\n' +
          'Obiettivo: presentarsi in modo professionale ai recruiter e alla community.',
      en: 'Create or improve your professional GitHub portfolio to present yourself at your best.\n\n' +
          'Goal: present yourself professionally to recruiters and the community.',
    },
    tasks: {
      it: [
        'Configura il profilo GitHub con bio, foto e link rilevanti',
        'Crea un repository profilo con README personale accattivante',
        'Seleziona e pinna 4-6 repository rappresentativi delle tue competenze',
        'Aggiungi un workflow GitHub Actions a uno dei tuoi progetti',
        'Contribuisci a un progetto open source documentando il processo'
      ],
      en: [
        'Set up the GitHub profile with bio, photo, and relevant links',
        'Create a profile repository with an engaging personal README',
        'Select and pin 4-6 repositories representative of your skills',
        'Add a GitHub Actions workflow to one of your projects',
        'Contribute to an open source project documenting the process'
      ]
    },
    successCriteria: {
      it: [
        'Profilo completo, professionale e coerente',
        'README profilo accattivante e ben formattato',
        'Repository pinati con README descrittivi e screenshot',
        'Workflow Actions funzionante con badge nel README',
        'Contributo open source documentato con PR link'
      ],
      en: [
        'Profile is complete, professional, and consistent',
        'Profile README is engaging and well-formatted',
        'Pinned repositories have descriptive READMEs and screenshots',
        'Actions workflow is working with a badge in the README',
        'Open source contribution is documented with PR link'
      ]
    },
    hints: {
      it: [
        'Usa immagini e badge con moderazione nel README',
        'Aggiungi screenshot e link a demo live quando possibile',
        'Mantieni il codice pulito e ben commentato nei repository pinati'
      ],
      en: [
        'Use images and badges sparingly in the README',
        'Add screenshots and links to live demos when possible',
        'Keep code clean and well-commented in pinned repositories'
      ]
    },
    estimatedMinutes: 90
  }
];


export const moduleContent: Record<string, { theoryLessons: TheoryLesson[]; practicalActivities: PracticalActivity[] }> = {
  'docker-compose': { theoryLessons: dockerLessons, practicalActivities: dockerActivities },
  'phpunit-tdd': { theoryLessons: phpunitLessons, practicalActivities: phpunitActivities },
  'github-actions': { theoryLessons: githubActionsLessons, practicalActivities: githubActionsActivities },
  'livewire3': { theoryLessons: livewireLessons, practicalActivities: livewireActivities },
  'tailwindcss': { theoryLessons: tailwindLessons, practicalActivities: tailwindActivities },
  'vuejs3': { theoryLessons: vueLessons, practicalActivities: vueActivities },
  'redis': { theoryLessons: redisLessons, practicalActivities: redisActivities },
  'rag-langchain': { theoryLessons: ragLangchainLessons, practicalActivities: ragLangchainActivities },
  'openai-php': { theoryLessons: openaiPhpLessons, practicalActivities: openaiPhpActivities },
  'mysql-acid': { theoryLessons: mysqlAcidLessons, practicalActivities: mysqlAcidActivities },
  'aws-basics': { theoryLessons: awsBasicsLessons, practicalActivities: awsBasicsActivities },
  'symfony-basics': { theoryLessons: symfonyBasicsLessons, practicalActivities: symfonyBasicsActivities },
  'embeddings-chromadb': { theoryLessons: embeddingsChromadbLessons, practicalActivities: embeddingsChromadbActivities },
  'mcp-tool-calling': { theoryLessons: mcpToolCallingLessons, practicalActivities: mcpToolCallingActivities },
  'typescript': { theoryLessons: typescriptLessons, practicalActivities: typescriptActivities },
  'laravel11': { theoryLessons: laravel11Lessons, practicalActivities: laravel11Activities },
  'prompt-engineering': { theoryLessons: promptEngineeringLessons, practicalActivities: promptEngineeringActivities },
  'technical-english': { theoryLessons: technicalEnglishLessons, practicalActivities: technicalEnglishActivities },
  'github-portfolio': { theoryLessons: githubPortfolioLessons, practicalActivities: githubPortfolioActivities }
};

export const getModuleContent = (slug: string) => {
  return moduleContent[slug] || { theoryLessons: [], practicalActivities: [] };
};
