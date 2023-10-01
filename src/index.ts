/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createUrl, createUrlSearchParams, request, type RequestConfig } from "@acdh-oeaw/lib";
import type {
	FilterKeys,
	HttpMethod,
	MediaType,
	OperationRequestBodyContent,
	PathsWithMethod,
	ResponseObjectMap,
	SuccessResponse,
} from "openapi-typescript-helpers";

interface ClientOptions {
	baseUrl: URL | string;
}
type ParamsOption<T> = T extends { parameters: any }
	? { params: NonNullable<T["parameters"]> }
	: { params?: never };
type RequestBodyOption<T> = OperationRequestBodyContent<T> extends never
	? { body?: never }
	: undefined extends OperationRequestBodyContent<T>
	? { body?: OperationRequestBodyContent<T> }
	: { body: OperationRequestBodyContent<T> };
type RequestOptions<T> = ParamsOption<T> & RequestBodyOption<T>;
type FetchOptions<T> = Omit<RequestConfig, "body"> & RequestOptions<T>;
type FetchResponse<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>;

export default function createClient<Paths extends {}>({ baseUrl }: ClientOptions) {
	function _request<P extends keyof Paths, M extends HttpMethod>(
		pathname: P,
		options: FetchOptions<M extends keyof Paths[P] ? Paths[P][M] : never>,
	): Promise<FetchResponse<M extends keyof Paths[P] ? Paths[P][M] : unknown>> {
		const { params = {}, ...init } = options;

		const url = createRequestUrl(baseUrl, pathname as string, params);

		return request(url, init as any) as any;
	}

	return {
		get<P extends PathsWithMethod<Paths, "get">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "get">>,
		) {
			return _request<P, "get">(pathname, { ...options, method: "get" } as any);
		},
		put<P extends PathsWithMethod<Paths, "put">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "put">>,
		) {
			return _request<P, "put">(pathname, { ...options, method: "put" } as any);
		},
		post<P extends PathsWithMethod<Paths, "post">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "post">>,
		) {
			return _request<P, "post">(pathname, { ...options, method: "post" } as any);
		},
		delete<P extends PathsWithMethod<Paths, "delete">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "delete">>,
		) {
			return _request<P, "delete">(pathname, { ...options, method: "delete" } as any);
		},
		options<P extends PathsWithMethod<Paths, "options">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "options">>,
		) {
			return _request<P, "options">(pathname, { ...options, method: "options" } as any);
		},
		head<P extends PathsWithMethod<Paths, "head">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "head">>,
		) {
			return _request<P, "head">(pathname, { ...options, method: "head" } as any);
		},
		patch<P extends PathsWithMethod<Paths, "patch">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "patch">>,
		) {
			return _request<P, "patch">(pathname, { ...options, method: "patch" } as any);
		},
		trace<P extends PathsWithMethod<Paths, "trace">>(
			pathname: P,
			options: FetchOptions<FilterKeys<Paths[P], "trace">>,
		) {
			return _request<P, "trace">(pathname, { ...options, method: "trace" } as any);
		},
	};
}

function createRequestUrl(
	baseUrl: URL | string,
	pathname: string,
	params: { path?: Record<string, any>; query?: Record<string, any> },
): URL {
	const { path, query } = params;

	const url = createUrl({
		baseUrl,
		pathname: path
			? pathname.replace(/{(.+?)}/g, (_, key) => encodeURIComponent(path[key]))
			: pathname,
		searchParams: query ? createUrlSearchParams(query) : undefined,
	});

	return url;
}
