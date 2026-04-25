import type { LearningModule } from '../types';
import { getModuleContent } from './content';

const baseModules: Omit<LearningModule, 'theoryLessons' | 'practicalActivities'>[] = [
  {
    id: 1,
    slug: 'docker-compose',
    title: { it: 'Docker Compose', en: 'Docker Compose' },
    description: { it: 'Containerizzazione e orchestrazione locale', en: 'Containerization and local orchestration' },
    category: 'DevOps'
  },
  {
    id: 2,
    slug: 'phpunit-tdd',
    title: { it: 'PHPUnit e TDD', en: 'PHPUnit and TDD' },
    description: { it: 'Testing guidato dal comportamento', en: 'Behavior-driven testing' },
    category: 'Backend PHP'
  },
  {
    id: 3,
    slug: 'github-actions',
    title: { it: 'GitHub Actions CI/CD', en: 'GitHub Actions CI/CD' },
    description: { it: 'Pipeline di integrazione e deployment', en: 'Integration and deployment pipeline' },
    category: 'DevOps'
  },
  {
    id: 4,
    slug: 'livewire3',
    title: { it: 'Livewire 3', en: 'Livewire 3' },
    description: { it: 'Componenti dinamici senza JS', en: 'Dynamic components without JS' },
    category: 'Backend PHP'
  },
  {
    id: 5,
    slug: 'tailwindcss',
    title: { it: 'Tailwind CSS', en: 'Tailwind CSS' },
    description: { it: 'Styling utility-first', en: 'Utility-first styling' },
    category: 'Frontend'
  },
  {
    id: 6,
    slug: 'vuejs3',
    title: { it: 'Vue.js 3', en: 'Vue.js 3' },
    description: { it: 'Interattivita frontend', en: 'Frontend interactivity' },
    category: 'Frontend'
  },
  {
    id: 7,
    slug: 'redis',
    title: { it: 'Redis Cache e Queue', en: 'Redis Cache and Queue' },
    description: { it: 'Performance e background jobs', en: 'Performance and background jobs' },
    category: 'Database'
  },
  {
    id: 8,
    slug: 'rag-langchain',
    title: { it: 'RAG e LangChain', en: 'RAG and LangChain' },
    description: { it: 'Retrieval Augmented Generation', en: 'Retrieval Augmented Generation' },
    category: 'AI Engineering'
  },
  {
    id: 9,
    slug: 'openai-php',
    title: { it: 'AI in PHP con OpenAI SDK', en: 'AI in PHP with OpenAI SDK' },
    description: { it: 'Integrazione IA nel backend', en: 'AI integration in backend' },
    category: 'AI Engineering'
  },
  {
    id: 10,
    slug: 'mysql-acid',
    title: { it: 'Transazioni MySQL ACID', en: 'MySQL ACID Transactions' },
    description: { it: 'Gestione dati robusta', en: 'Robust data management' },
    category: 'Database'
  },
  {
    id: 11,
    slug: 'aws-basics',
    title: { it: 'AWS S3 EC2 RDS', en: 'AWS S3 EC2 RDS' },
    description: { it: 'Cloud infrastructure', en: 'Cloud infrastructure' },
    category: 'DevOps'
  },
  {
    id: 12,
    slug: 'symfony-basics',
    title: { it: 'Symfony Basi', en: 'Symfony Basics' },
    description: { it: 'Componenti fondamentali', en: 'Core components' },
    category: 'Backend PHP'
  },
  {
    id: 13,
    slug: 'embeddings-chromadb',
    title: { it: 'Embeddings e ChromaDB', en: 'Embeddings and ChromaDB' },
    description: { it: 'Vector database per AI', en: 'Vector database for AI' },
    category: 'AI Engineering'
  },
  {
    id: 14,
    slug: 'mcp-tool-calling',
    title: { it: 'MCP Tool Calling', en: 'MCP Tool Calling' },
    description: { it: 'Model Context Protocol', en: 'Model Context Protocol' },
    category: 'AI Engineering'
  },
  {
    id: 15,
    slug: 'typescript',
    title: { it: 'TypeScript Base', en: 'TypeScript Basics' },
    description: { it: 'Type safety frontend', en: 'Frontend type safety' },
    category: 'Frontend'
  },
  {
    id: 16,
    slug: 'laravel11',
    title: { it: 'Laravel 11 Novita', en: 'Laravel 11 Features' },
    description: { it: 'Features moderne del framework', en: 'Modern framework features' },
    category: 'Backend PHP'
  },
  {
    id: 17,
    slug: 'prompt-engineering',
    title: { it: 'Prompt Engineering', en: 'Prompt Engineering' },
    description: { it: 'Ottimizzazione LLM', en: 'LLM optimization' },
    category: 'AI Engineering'
  },
  {
    id: 18,
    slug: 'technical-english',
    title: { it: 'Inglese Tecnico', en: 'Technical English' },
    description: { it: 'Lessico professionale', en: 'Professional vocabulary' },
    category: 'Soft Skill'
  },
  {
    id: 19,
    slug: 'github-portfolio',
    title: { it: 'Revisione Progetti GitHub', en: 'GitHub Portfolio Review' },
    description: { it: 'Portfolio e code review', en: 'Portfolio and code review' },
    category: 'Portfolio'
  }
];

export const categories = [
  'DevOps',
  'Backend PHP',
  'Frontend',
  'Database',
  'AI Engineering',
  'Soft Skill',
  'Portfolio'
];

// Merge base modules with content
export const modules: LearningModule[] = baseModules.map(m => ({
  ...m,
  ...getModuleContent(m.slug)
}));
