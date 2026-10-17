import {flatRoutes} from '@react-router/fs-routes';
import {type RouteConfig} from '@react-router/dev/routes';

/** File-based routes only. Hydrogen's virtual dev routes (GraphiQL, profiler) need a storefront client, so they are off. */
export default [...(await flatRoutes())] satisfies RouteConfig;
