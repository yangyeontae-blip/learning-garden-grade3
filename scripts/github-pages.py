"""Publish this project's verified static site using existing Git credentials.

Credentials stay in memory and are never printed or written to the repository.
Usage: python scripts/github-pages.py create|enable|status|dispatch
"""
import json
import os
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OWNER = 'yangyeontae-blip'
REPO = 'learning-garden-grade3'


def credentials():
    env = dict(os.environ, GIT_TERMINAL_PROMPT='0', GCM_INTERACTIVE='never')
    result = subprocess.run(['git', 'credential', 'fill'], input='protocol=https\nhost=github.com\n\n', text=True, capture_output=True, env=env, check=True)
    values = dict(line.split('=', 1) for line in result.stdout.splitlines() if '=' in line)
    if not values.get('password'):
        raise RuntimeError('No existing GitHub credential available')
    return values['password']


TOKEN = credentials()


def api(path, method='GET', payload=None):
    req = urllib.request.Request('https://api.github.com' + path, method=method,
        data=None if payload is None else json.dumps(payload).encode(), headers={
            'Authorization': 'Bearer ' + TOKEN,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Learning-Garden-Deploy',
            'X-GitHub-Api-Version': '2022-11-28'
        })
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as error:
        message = error.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'GitHub API {method} {path}: {error.code}: {message}') from None


def main():
    user = api('/user')
    if user['login'] != OWNER:
        raise RuntimeError('Authenticated GitHub account does not match the selected owner')
    command = sys.argv[1] if len(sys.argv) > 1 else 'status'
    repo_path = f'/repos/{OWNER}/{REPO}'
    if command == 'create':
        # Only create a new repository; never replace or reuse an unrelated one.
        result = api('/user/repos', 'POST', {
            'name': REPO,
            'description': '배움정원 — 2022 개정 교육과정과 연결한 초등 3학년 9개 교과 학습자료',
            'private': False,
            'auto_init': False,
            'has_issues': True,
            'has_wiki': False,
            'homepage': f'https://{OWNER}.github.io/{REPO}/'
        })
        print(json.dumps({'repository': result['html_url'], 'clone_url': result['clone_url']}, ensure_ascii=False))
    elif command == 'enable':
        result = api(repo_path + '/pages', 'POST', {'build_type': 'workflow'})
        print(json.dumps({'url': result.get('html_url'), 'build_type': result.get('build_type')}, ensure_ascii=False))
    elif command == 'dispatch':
        api(repo_path + '/actions/workflows/pages.yml/dispatches', 'POST', {'ref': 'main'})
        print('Deployment workflow requested.')
    elif command == 'status':
        runs = api(repo_path + '/actions/workflows/pages.yml/runs?per_page=3')
        print(json.dumps([{'id': run['id'], 'status': run['status'], 'conclusion': run['conclusion'], 'url': run['html_url'], 'sha': run['head_sha']} for run in runs['workflow_runs']], ensure_ascii=False))
        pages = api(repo_path + '/pages')
        print(json.dumps({'pages_url': pages.get('html_url'), 'build_type': pages.get('build_type'), 'status': pages.get('status')}, ensure_ascii=False))
    elif command == 'jobs':
        runs = api(repo_path + '/actions/workflows/pages.yml/runs?per_page=1')
        jobs = api(repo_path + f"/actions/runs/{runs['workflow_runs'][0]['id']}/jobs")
        print(json.dumps([{'name': job['name'], 'conclusion': job['conclusion'], 'status': job['status'], 'steps': [{'name': step['name'], 'conclusion': step['conclusion']} for step in job.get('steps', [])]} for job in jobs['jobs']], ensure_ascii=False))
    else:
        raise RuntimeError('Expected create, enable, status, dispatch, or jobs')


if __name__ == '__main__':
    main()
