import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        testTimeout: 45000,
        include: ['test/_testsuite.js']
    }
});
