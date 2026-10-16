import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, type ServerBuild} from 'react-router';
import {createDigsRouterContext} from '~/lib/context';

/**
 * Oxygen-style fetch handler on the mock adapter. React Router's own request handler is used
 * (Hydrogen's expects the Storefront context, which this phase does not create).
 */
export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    try {
      const context = await createDigsRouterContext(request, env, executionContext);
      const handleRequest = createRequestHandler(serverBuild as unknown as ServerBuild, process.env.NODE_ENV);
      const response = await handleRequest(request, context);
      if (context.session.isPending) {
        response.headers.set('Set-Cookie', await context.session.commit());
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
