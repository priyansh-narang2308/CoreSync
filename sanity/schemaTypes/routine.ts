import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'routine',
    title: 'Routine',
    type: 'document',
    icon: () => '📋',
    fields: [
        defineField({
            name: 'name',
            title: 'Routine Name',
            description: 'e.g., Push Day, Full Body, Morning Yoga',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'userId',
            title: 'User ID',
            description: 'The Clerk User ID this routine belongs to',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'Optional notes about this routine',
            type: 'text',
        }),
        defineField({
            name: 'exercises',
            title: 'Exercises',
            description: 'Exercises included in this routine',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'exercise' }],
                },
            ],
            validation: (Rule) => Rule.min(1).error('A routine must have at least one exercise'),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            exercises: 'exercises',
        },
        prepare({ title, exercises }) {
            const count = Array.isArray(exercises) ? exercises.length : 0
            return {
                title,
                subtitle: `${count} exercise${count === 1 ? '' : 's'}`,
            }
        },
    },
})
