import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'vite';

const source = await readFile(new URL('../src/pages/MemberDashboardPage.jsx', import.meta.url), 'utf8');
const content = source.slice(source.indexOf('function DashboardContent('), source.indexOf('function DashboardOverview('));
const errorState = source.slice(source.indexOf('function ErrorState('), source.indexOf('function ProgramRequiredState('));
const result = await build({
  configFile: false,
  logLevel: 'silent',
  plugins: [{
    name: 'dashboard-recovery-test',
    resolveId(id) { if (id.endsWith('dashboard-test.jsx')) return id; },
    load(id) {
      if (!id.endsWith('dashboard-test.jsx')) return;
      return `import React from 'react';
        const DashboardOverview = () => <div>Saved overview</div>;
        const LoadingState = () => <div>Loading</div>;
        const ProgramRequiredState = () => <div>Program required</div>;
        const WeightSection = () => <form>Weight editor</form>;
        const WorkoutSection = () => <form>Workout editor</form>;
        const NutritionSection = () => <form>Nutrition editor</form>;
        const RecordsSection = () => <form>Records editor</form>;
        ${content}\n${errorState}\nexport { DashboardContent };`;
    },
  }],
  build: {
    write: false,
    lib: { entry: 'dashboard-test.jsx', formats: ['es'] },
    rolldownOptions: { external: ['react', 'react/jsx-runtime'] },
  },
});
const output = Array.isArray(result) ? result[0].output : result.output;
const code = output.find(item => item.type === 'chunk').code
  .replace(/["']react\/jsx-runtime["']/g, JSON.stringify(import.meta.resolve('react/jsx-runtime'))).replace(/["']react["']/g, JSON.stringify(import.meta.resolve('react')));
const { DashboardContent } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const render = props => renderToStaticMarkup(createElement(DashboardContent, {
  activeSection: 'workouts', onRefresh() {}, isLoading: false, error: '', ...props,
}));

test('failed refresh keeps the saved overview, marks it stale, and pauses editing', () => {
  const html = render({ dashboard: { program: { id: 1 } }, error: 'Server unavailable' });
  assert.match(html, /Saved overview/);
  assert.match(html, /Recent changes may not appear yet/);
  assert.match(html, /role="alert"/);
  assert.match(html, />Retry<\/button>/);
  assert.doesNotMatch(html, /<form/);
});

test('initial load failure offers retry without inventing empty dashboard data', () => {
  const html = render({ dashboard: null, error: 'Server unavailable' });
  assert.match(html, />Retry<\/button>/);
  assert.doesNotMatch(html, /Saved overview|Program required|<form/);
});

test('successful refresh restores the selected editor', () => {
  const html = render({ dashboard: { program: { id: 1 }, workouts: [] } });
  assert.match(html, /Workout editor/);
  assert.doesNotMatch(html, /Retry|Saved overview/);
});
