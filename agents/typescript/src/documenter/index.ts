/**
 * Documenter Agent - Main Application
 */

import express from 'express';
import { A2AHandler } from '../common/a2a-handler.js';
import { getAgentCard, SYSTEM_PROMPT } from './config.js';

const app = express();
const agentCard = getAgentCard();

const handler = new A2AHandler(app, agentCard, SYSTEM_PROMPT);

const port = parseInt(process.env.PORT || '8087', 10);
handler.start(port);
