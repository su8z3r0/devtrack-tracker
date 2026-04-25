import type { TheoryLesson, PracticalActivity } from '../types';

export const dockerComposeLessons: TheoryLesson[] = [
  {
    id: 'docker-intro',
    title: {
      it: 'Introduzione a Docker',
      en: 'Docker Introduction'
    },
    content: {
      it: `Docker è una piattaforma open-source che permette di automatizzare il deployment di applicazioni all'interno di container software. I container sono ambienti isolati che includono tutto il necessario per eseguire un'applicazione: codice, runtime, librerie di sistema, strumenti e configurazioni.

**Vantaggi dei Container:**
- **Isolamento**: Ogni container è indipendente e non interferisce con altri
- **Portabilità**: Il container funziona ovunque (dev, staging, produzione)
- **Efficienza**: Condividono il kernel del sistema operativo host
- **Scalabilità**: Facile replicare e scalare orizzontalmente

**Container vs VM:**
A differenza delle macchine virtuali, i container non includono un sistema operativo completo ma condividono il kernel dell'host. Questo li rende più leggeri e veloci da avviare (secondi anziché minuti).`,
      en: `Docker is an open-source platform that automates the deployment of applications inside software containers. Containers are isolated environments that include everything needed to run an application: code, runtime, system libraries, tools, and configurations.

**Container Benefits:**
- **Isolation**: Each container is independent and doesn't interfere with others
- **Portability**: The container works anywhere (dev, staging, production)
- **Efficiency**: They share the host OS kernel
- **Scalability**: Easy to replicate and scale horizontally

**Containers vs VMs:**
Unlike virtual machines, containers don't include a complete operating system but share the host's kernel. This makes them lighter and faster to start (seconds instead of minutes).`
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
        code: `# Dockerfile - Istruzioni principali
FROM php:8.3-fpm

# Installa dipendenze
RUN apt-get update && apt-get install -y \\
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# Installa estensioni PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Working directory
WORKDIR /var/www

# Copia file applicazione
COPY . .

# Comando di avvio
CMD ["php-fpm"]`,
        explanation: 'Esempio di Dockerfile per applicazione PHP'
      },
      {
        language: 'bash',
        code: `# Comandi Docker essenziali
docker build -t myapp:1.0 .        # Costruisce immagine
docker run -d -p 8000:80 myapp:1.0  # Avvia container
docker ps                           # Lista container attivi
docker logs container_name          # Visualizza log
docker exec -it container bash      # Accedi al container`,
        explanation: 'Comandi base per gestire container Docker'
      }
    ],
    estimatedMinutes: 15
  },
  {
    id: 'docker-compose-basics',
    title: {
      it: 'Docker Compose: Orchestrazione Multi-Container',
      en: 'Docker Compose: Multi-Container Orchestration'
    },
    content: {
      it: `Docker Compose è uno strumento per definire e gestire applicazioni multi-container. Con un singolo file YAML, configuri tutti i servizi necessari: database, cache, web server, worker.

**Struttura di docker-compose.yml:**
- **services**: Definisce i container da creare
- **volumes**: Persistenza dati tra riavvii
- **networks**: Comunicazione tra container
- **depends_on**: Ordine di avvio dei servizi

**Rete Interna:**
I container nello stesso servizio possono comunicare usando il nome del servizio come hostname. Compose crea automaticamente una rete bridge per i tuoi container.`,
      en: `Docker Compose is a tool for defining and running multi-container applications. With a single YAML file, you configure all needed services: database, cache, web server, worker.

**docker-compose.yml Structure:**
- **services**: Defines containers to create
- **volumes**: Data persistence across restarts
- **networks**: Communication between containers
- **depends_on**: Service startup order

**Internal Network:**
Containers in the same service can communicate using the service name as hostname. Compose automatically creates a bridge network for your containers.`
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
        code: `# docker-compose.yml - Esempio applicazione PHP
services:
  app:
    build: ./docker/php
    volumes:
      - ./:/var/www
    networks:
      - app-network
    depends_on:
      - db
      - redis

  web:
    image: nginx:alpine
    ports:
      - "8000:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx:/etc/nginx/conf.d
    networks:
      - app-network

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

  redis:
    image: redis:alpine
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db_data:`,
        explanation: 'Configurazione completa con PHP, Nginx, MySQL e Redis'
      }
    ],
    estimatedMinutes: 20
  },
  {
    id: 'docker-volumes-networks',
    title: {
      it: 'Volumi, Reti e Persistenza',
      en: 'Volumes, Networks and Persistence'
    },
    content: {
      it: `I dati nei container sono effimeri di default. Quando un container viene rimosso, anche i suoi dati scompaiono. I volumi risolvono questo problema.

**Tipi di Storage:**
- **Bind Mounts**: Montano una directory dell'host nel container
- **Named Volumes**: Gestiti da Docker, persistono anche se rimuovi il container
- **tmpfs**: Storage in memoria, volatile

**Reti Docker:**
- **bridge**: Rete privata interna (default)
- **host**: Condivide la rete dell'host
- **overlay**: Per container su host multipli (Swarm)
- **none**: Nessuna rete

**Best Practices:**
- Usa named volumes per i dati del database
- Separare i log in volumi dedicati
- Configurare healthcheck per i servizi critici`,
      en: `Data in containers is ephemeral by default. When a container is removed, its data disappears too. Volumes solve this problem.

**Storage Types:**
- **Bind Mounts**: Mount a host directory into the container
- **Named Volumes**: Managed by Docker, persist even if container removed
- **tmpfs**: In-memory storage, volatile

**Docker Networks:**
- **bridge**: Private internal network (default)
- **host**: Shares host's network
- **overlay**: For containers on multiple hosts (Swarm)
- **none**: No network

**Best Practices:**
- Use named volumes for database data
- Separate logs into dedicated volumes
- Configure healthcheck for critical services`
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
        code: `services:
  db:
    image: mysql:8.0
    volumes:
      # Named volume per dati persistenti
      - db_data:/var/lib/mysql
      # Bind mount per script di init
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      MYSQL_ROOT_PASSWORD: $\{DB_ROOT_PASSWORD}
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db  # Nome del servizio = hostname DNS
      DB_NAME: myapp
    networks:
      - backend
      - frontend

networks:
  backend:
    internal: true  # Non esposta all'esterno
  frontend:
    driver: bridge

volumes:
  db_data:
    driver: local`,
        explanation: 'Volumi persistenti, healthcheck e reti isolate'
      }
    ],
    estimatedMinutes: 15
  }
];

export const dockerComposeActivities: PracticalActivity[] = [
  {
    id: 'docker-activity-1',
    title: {
      it: 'Containerizza un\'Applicazione PHP',
      en: 'Containerize a PHP Application'
    },
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
        'MySQL è accessibile dall\'applicazione',
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
    estimatedMinutes: 45
  },
  {
    id: 'docker-activity-2',
    title: {
      it: 'Multi-Stage Build e Ottimizzazione',
      en: 'Multi-Stage Build and Optimization'
    },
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
        'L\'immagine finale è significativamente più piccola',
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
    estimatedMinutes: 30
  }
];
