// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    alias: {
        "~": "/<rootDir>",
    },
    publicRuntimeConfig: {
        IMAGE_URL: process.env.NODE_ENV === 'development' ? process.env.DEV_IMG_URL : process.env.PRO_IMG_URL,
    }
})
