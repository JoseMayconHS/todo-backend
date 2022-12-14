const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	collectCoverage: true,
	cache: false,
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	setupFiles: ['<rootDir>/jest.env.js'],
}
