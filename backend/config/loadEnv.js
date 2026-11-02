import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = fileURLToPath(new URL('../', import.meta.url));

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(backendRoot, '.env.local') });
}

dotenv.config({ path: path.join(backendRoot, '.env') });
