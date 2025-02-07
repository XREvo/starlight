import { z } from 'astro/zod';

const indexWeightSchema = z.number().nonnegative().optional();
const pagefindRankingWeightsSchema = z
	.object({
		/**
		 * Set Pagefind’s `pageLength` ranking option.
		 *
		 * The default value is `0.1` and values must be in the range `0` to `1`.
		 *
		 * @see https://pagefind.app/docs/ranking/#configuring-page-length
		 */
		pageLength: z.number().min(0).max(1).default(0.1),
		/**
		 * Set Pagefind’s `termFrequency` ranking option.
		 *
		 * The default value is `0.1` and values must be in the range `0` to `1`.
		 *
		 * @see https://pagefind.app/docs/ranking/#configuring-term-frequency
		 */
		termFrequency: z.number().min(0).max(1).default(0.1),
		/**
		 * Set Pagefind’s `termSaturation` ranking option.
		 *
		 * The default value is `2` and values must be in the range `0` to `2`.
		 *
		 * @see https://pagefind.app/docs/ranking/#configuring-term-saturation
		 */
		termSaturation: z.number().min(0).max(2).default(2),
		/**
		 * Set Pagefind’s `termSimilarity` ranking option.
		 *
		 * The default value is `9` and values must be greater than or equal to `0`.
		 *
		 * @see https://pagefind.app/docs/ranking/#configuring-term-similarity
		 */
		termSimilarity: z.number().min(0).default(9),
	});
const pagefindIndexOptionsSchema = z.object({
    /** 
	 * Overrides the URL path that Pagefind uses to load its search bundle
	 * */
	basePath: z.string().optional(),
    /**
	 * Appends the given baseURL to all search results. May be a path, or a full domain
	 * */
	baseUrl: z.string().optional(),
    /**
     * Multiply all rankings for this index by the given weight.
     */
	indexWeight: indexWeightSchema,
    /**
     * Merge this filter object into all search queries in this index.
     *
     * Only applies in multisite setups.
	 * 
	 * Expected formalism is an object :
	 * - with keys as the filter names 
	 * - and values as the filter values, represented as a string or an array of strings.
     */
	mergeFilter: z.record(
		z.string(),
		z.string().or(
			z.array(z.string()).nonempty()
		)
	).optional(),
    /**
     * Language of this index.
     */
	language: z.string().optional(),
    /**
     * Provides the ability to fine tune Pagefind's ranking algorithm to better suit your dataset.
     */
	ranking: pagefindRankingWeightsSchema.optional(),
});

const pagefindSchema = z.object({
	/**
	 * Set Pagefind’s `pageLength` ranking option.
	 * 
	 * Configure how search result in the current website are weighted by Pagefind
	 * compared to other sit'e's merge indexes.
	 *
	 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
	 */
	indexWeight: indexWeightSchema,
	/** Configure how search result rankings are calculated by Pagefind. */
	ranking: pagefindRankingWeightsSchema.default({}),
	/**
	 * Configure how search indexes from different sites are merged by Pagefind.
	 *
	 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
	 */
	mergeIndex: z
		.array(
			/**
			 * Each entry of this array represents a `PagefindIndexOptions` from pagefind.
			 *
			 * @see https://github.com/CloudCannon/pagefind/blob/v1.3.0/pagefind_web_js/lib/coupled_search.ts#L549
			 */
			pagefindIndexOptionsSchema.extend({
				/**
				 * Set Pagefind’s `bundlePath` mergeIndex option.
				 * 
				 * This option is not part of the `PagefindIndexOptions` type on pagefind, 
				 * but it's presence is checked before using it on the pagefind_ui module.
				 *
				 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
				 * @see https://github.com/CloudCannon/pagefind/blob/v1.3.0/pagefind_ui/modular/modular-core.js#L192
				 */
				bundlePath: z.string(),
			})
		)
		.optional(),
});

export const PagefindConfigSchema = () => pagefindSchema;
export const PagefindConfigDefaults = () => pagefindSchema.parse({});
