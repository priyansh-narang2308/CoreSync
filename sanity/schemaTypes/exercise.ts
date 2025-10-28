import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'exercise',
    title: 'Exercise',
    type: 'document',
    icon: () => "🏋️‍♂️",
    fields: [
        defineField({
            name: 'name',
            title: 'Exercise Name',
            description: 'The name of the exercise that will be displayed to the user.',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'The description explaining the exercise on how to perform it.',
            type: 'text',
            rows: 4
        }),
        defineField({
            name: 'difficulty',
            title: 'Difficulty Level',
            description: 'The difficulty level of the exercise to help the user choose the appropriate workouts.',
            type: 'string',
            options: {
                list: [
                    { title: 'Beginner', value: 'beginner' },
                    { title: 'Intermediate', value: 'intermediate' },
                    { title: 'Advanced', value: 'advanced' },
                ],
                layout: 'radio',
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: ' Exercise Image',
            description: 'The image of the exercise that will be displayed to the user with a proper form.',
            type: 'image',
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alt Text",
                    description: "Description of the exercise image for accessibilty and SEO purposes."
                },
            ],
            options: { hotspot: true },
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            description: "A Youtube URL link to the video demonstration of the exercise",
            type: 'url',
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            description:"Toggle to show, to add or remove from the app",
            type: 'boolean',
            initialValue: true,
        }),
    ],

    preview: {
        select: {
            title: "name",
            subtitle: "difficulty",
            media: "image"
        }
    }
})


