import { z } from 'zod'

export const contributionsQuery = /* GraphQL */ `
	query WrappedContributions(
		$login: String!
		$from: DateTime!
		$to: DateTime!
	) {
		user(login: $login) {
			login
			name
			avatarUrl
			followers {
				totalCount
			}
			repositories {
				totalCount
			}
			contributionsCollection(from: $from, to: $to) {
				totalCommitContributions
				contributionCalendar {
					weeks {
						contributionDays {
							date
							contributionCount
						}
					}
				}
				commitContributionsByRepository {
					contributions {
						totalCount
					}
					repository {
						name
						stargazerCount
						primaryLanguage {
							name
						}
					}
				}
			}
		}
	}
`

const totalCountSchema = z.object({
	totalCount: z.number().int().nonnegative(),
})

const userSchema = z.object({
	login: z.string(),
	name: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	followers: totalCountSchema,
	repositories: totalCountSchema,
	contributionsCollection: z.object({
		totalCommitContributions: z.number().int().nonnegative(),
		contributionCalendar: z.object({
			weeks: z.array(
				z.object({
					contributionDays: z.array(
						z.object({
							date: z.string(),
							contributionCount: z.number().int().nonnegative(),
						}),
					),
				}),
			),
		}),
		commitContributionsByRepository: z.array(
			z.object({
				contributions: totalCountSchema,
				repository: z.object({
					name: z.string(),
					stargazerCount: z.number().int().nonnegative(),
					primaryLanguage: z.object({ name: z.string() }).nullable(),
				}),
			}),
		),
	}),
})

export const graphQLResponseSchema = z.object({
	data: z.object({ user: userSchema.nullable() }).nullable(),
	errors: z
		.array(z.object({ message: z.string(), type: z.string().optional() }))
		.optional(),
})

export type GraphQLUser = z.infer<typeof userSchema>

export const searchCommitsResponseSchema = z.object({
	total_count: z.number().int().nonnegative(),
	items: z.array(
		z.object({
			commit: z.object({
				author: z.object({ date: z.string() }).nullable(),
			}),
		}),
	),
})
