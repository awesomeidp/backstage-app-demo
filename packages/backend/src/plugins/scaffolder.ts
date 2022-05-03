import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createHttpBackstageAction } from "@roadiehq/scaffolder-backend-module-http-request";
import { createZipAction, createWriteFileAction, createAppendFileAction, createSleepAction } from '@roadiehq/scaffolder-backend-module-utils';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });
  
  const actions = [...builtInActions, 
    createHttpBackstageAction({ config: env.config }), 
    createWriteFileAction(),
    createSleepAction(),
    createZipAction(),
    createAppendFileAction()];

  return await createRouter({
    catalogClient,
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}