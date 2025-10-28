import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'workout',
    title: 'Workout',
    type: 'document',
    icon: () => '📓',
    fields: [
        defineField({
            name: 'userId',
            title: 'User ID',
            description: "Clerk user's ID of the person performing this workout",
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Workout Date',
            description: "The date when this workout was performed",
            type: 'datetime',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'duration',
            title: 'Duration (seconds)',
            description: "The total duration of the workout in seconds",
            type: 'number',
            validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
            name: 'exercises',
            title: 'Workout Exercises',
            description: "The exercises performed in this workout with sets, reps and weights",
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'workoutExercise',
                    title: 'Workout Exercise',
                    fields: [
                        defineField({
                            name: 'exercise',
                            title: 'Exercise',
                            description: "The exercise that was performed",
                            type: 'reference',
                            to: [{ type: 'exercise' }],
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'sets',
                            title: 'Sets',
                            description: 'The sets performed for this exercise with reps,and weight details',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'exerciseSet',
                                    title: 'Exercise Set',
                                    fields: [
                                        defineField({
                                            name: 'reps',
                                            title: 'Repetitions',
                                            type: 'number',
                                            validation: (rule) => rule.min(1).integer(),
                                        }),
                                        defineField({
                                            name: 'weight',
                                            title: 'Weight',
                                            type: 'number',
                                            validation: (rule) => rule.min(0),
                                        }),
                                        defineField({
                                            name: 'weightUnit',
                                            title: 'Weight Unit',
                                            type: 'string',
                                            options: {
                                                list: [
                                                    { title: 'Pounds (lbs)', value: 'lbs' },
                                                    { title: 'Kilograms (kgs)', value: 'kgs' },
                                                ],
                                                layout: 'radio',
                                            },
                                            validation: (rule) => rule.required(),
                                        }),
                                    ],
                                    preview: {
                                        select: { reps: 'reps', weight: 'weight', unit: 'weightUnit' },
                                        prepare(sel) {
                                            const { reps, weight, unit } = sel as { reps?: number; weight?: number; unit?: string }
                                            const parts: string[] = []
                                            if (typeof reps === 'number') parts.push(`${reps} reps`)
                                            if (typeof weight === 'number') parts.push(`${weight} ${unit ?? ''}`.trim())
                                            return { title: parts.join(' • ') || 'Set' }
                                        },
                                    },
                                },
                            ],
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'exercise.name',
                            sets: 'sets',
                            media: 'exercise.image',
                        },
                        prepare(selection) {
                            const { title, sets, media } = selection as {
                                title?: string
                                sets?: Array<unknown>
                                media?: unknown
                            }
                            const count = Array.isArray(sets) ? sets.length : 0
                            const subtitleParts: string[] = [count ? `${count} set${count === 1 ? '' : 's'}` : undefined].filter(Boolean) as string[]
                            return {
                                title: title ?? 'Exercise',
                                subtitle: subtitleParts.join(' • '),
                                media: media as any,
                            }
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            date: 'date',
            duration: 'duration',
            exercises: 'exercises',
        },
        prepare(selection) {
            const { date, duration, exercises } = selection as {
                date?: string
                duration?: number
                exercises?: Array<unknown>
            }

            const count = Array.isArray(exercises) ? exercises.length : 0

            const formatDuration = (seconds?: number) => {
                if (typeof seconds !== 'number' || !isFinite(seconds) || seconds < 0) return undefined
                const m = Math.floor(seconds / 60)
                const s = Math.floor(seconds % 60)
                return `${m}m ${s}s`
            }

            const dateText = date ? new Date(date).toLocaleString() : 'No date'
            const durationText = formatDuration(duration)

            return {
                title: `Workout • ${dateText}`,
                subtitle: [count ? `${count} exercise${count === 1 ? '' : 's'}` : undefined, durationText]
                    .filter(Boolean)
                    .join(' • '),
            }
        },
    },
})


