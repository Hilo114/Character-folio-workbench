const APP_ID = 'character-forge-floating-window-v1';
const CLEANUP_KEY = '__characterForgeFloatingWindowCleanupV1';
const SETTINGS_KEY = 'character_forge_settings_v1';
const CANDIDATE_FIELDS = [
  ['name', '名字', 'text'],
  ['tags', '标签', 'text'],
  ['age', '年龄', 'text'],
  ['appearance', '外貌', 'textarea'],
  ['bio', '简介', 'textarea'],
  ['quote', '代表性发言', 'textarea'],
];
const PARAM_DEFS = [
  { key: 'max_tokens', label: '最大回复 Tokens', min: 1, max: 200000, step: 1, integer: true },
  { key: 'temperature', label: '温度', min: 0, max: 2, step: 0.05 },
  { key: 'frequency_penalty', label: '频率惩罚', min: -2, max: 2, step: 0.05 },
  { key: 'presence_penalty', label: '存在惩罚', min: -2, max: 2, step: 0.05 },
  { key: 'top_p', label: 'Top P', min: 0, max: 1, step: 0.05 },
  { key: 'top_k', label: 'Top K', min: 0, max: 1000, step: 1, integer: true },
];

const DEFAULT_SETTINGS = {
  apiurl: '',
  key: '',
  model: '',
  params: Object.fromEntries(PARAM_DEFS.map(({ key }) => [key, { mode: 'unset', value: '' }])),
  insertion: {
    type: 'at_depth',
    depth: 4,
    order: 100,
  },
  usePersona: false,
  useWorldInfo: false,
  useJsonSchema: true,
};

const candidateSchema = {
  name: 'character_candidates',
  description: '五个可供用户编辑和选择的角色候选档案',
  strict: true,
  value: {
    type: 'object',
    additionalProperties: false,
    properties: {
      candidates: {
        type: 'array',
        minItems: 5,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string', description: '角色名字' },
            tags: { type: 'string', description: '简洁的人设标签' },
            age: { type: 'string', description: '年龄或年龄范围' },
            appearance: { type: 'string', description: '外貌描述' },
            bio: { type: 'string', description: '角色简介' },
            quote: { type: 'string', description: '能体现人物特点的代表性发言' },
          },
          required: ['name', 'tags', 'age', 'appearance', 'bio', 'quote'],
        },
      },
    },
    required: ['candidates'],
  },
};

const completeSchema = {
  name: 'complete_character_profile',
  description: '可直接写入世界书的完整角色档案数据',
  strict: true,
  value: {
    type: 'object',
    additionalProperties: false,
    properties: {
      basic: {
        type: 'object',
        additionalProperties: false,
        properties: {
          gender: { type: 'string' },
          race: { type: 'string' },
          age: { type: 'string' },
          height: { type: 'string' },
          cup: { type: 'string' },
          identity: { type: 'string' },
        },
        required: ['gender', 'race', 'age', 'height', 'cup', 'identity'],
      },
      background: { type: 'string' },
      appearance: {
        type: 'object',
        additionalProperties: false,
        properties: {
          face: { type: 'string' },
          eyes: { type: 'string' },
          hair: { type: 'string' },
          body: { type: 'string' },
          skin: { type: 'string' },
          intimateParts: { type: 'string' },
        },
        required: ['face', 'eyes', 'hair', 'body', 'skin', 'intimateParts'],
      },
      sexuality: {
        type: 'object',
        additionalProperties: false,
        properties: {
          orientation: { type: 'string' },
          experience: { type: 'string' },
        },
        required: ['orientation', 'experience'],
      },
      details: {
        type: 'object',
        additionalProperties: false,
        properties: {
          languageStyle: { type: 'string' },
          socialAbility: { type: 'string' },
          darkSide: { type: 'string' },
          decisionStyle: { type: 'string' },
          values: {
            type: 'object',
            additionalProperties: false,
            properties: {
              priorities: { type: 'string' },
              likes: { type: 'string' },
              dislikes: { type: 'string' },
            },
            required: ['priorities', 'likes', 'dislikes'],
          },
          traits: { type: 'string' },
        },
        required: [
          'languageStyle',
          'socialAbility',
          'darkSide',
          'decisionStyle',
          'values',
          'traits',
        ],
      },
      corePersonality: {
        type: 'object',
        additionalProperties: false,
        properties: {
          definition: { type: 'string' },
          manifestations: {
            type: 'array',
            minItems: 5,
            maxItems: 5,
            items: { type: 'string' },
          },
        },
        required: ['definition', 'manifestations'],
      },
      secondaryPersonality1: {
        type: 'object',
        additionalProperties: false,
        properties: {
          definition: { type: 'string' },
          manifestations: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: { type: 'string' },
          },
        },
        required: ['definition', 'manifestations'],
      },
      secondaryPersonality2: {
        type: 'object',
        additionalProperties: false,
        properties: {
          definition: { type: 'string' },
          manifestations: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: { type: 'string' },
          },
        },
        required: ['definition', 'manifestations'],
      },
      secondaryPersonality3: {
        type: 'object',
        additionalProperties: false,
        properties: {
          definition: { type: 'string' },
          manifestations: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: { type: 'string' },
          },
        },
        required: ['definition', 'manifestations'],
      },
      secondaryPersonality4: {
        type: 'object',
        additionalProperties: false,
        properties: {
          definition: { type: 'string' },
          manifestations: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: { type: 'string' },
          },
        },
        required: ['definition', 'manifestations'],
      },
    },
    required: [
      'basic',
      'background',
      'appearance',
      'sexuality',
      'details',
      'corePersonality',
      'secondaryPersonality1',
      'secondaryPersonality2',
      'secondaryPersonality3',
      'secondaryPersonality4',
    ],
  },
};

const styles = `
#${APP_ID}{position:fixed!important;z-index:2147483646!important;font-family:"Microsoft YaHei UI","PingFang SC","Noto Sans CJK SC",sans-serif;user-select:none;-webkit-user-select:none;color-scheme:light;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;--ink:#20272b;--muted:#69757b;--paper:#f4f0e7;--paper-2:#e9e1d2;--line:#c9beab;--red:#a94d3f;--red-soft:#ead2ca;--blue:#326b78;--blue-soft:#d7e5e5;--ok:#376b4a;--warn:#946422}
#${APP_ID} *,#${APP_ID} *:before,#${APP_ID} *:after{box-sizing:border-box;text-shadow:none!important}
#${APP_ID} button,#${APP_ID} input,#${APP_ID} textarea,#${APP_ID} select{font:inherit}
#${APP_ID} button{touch-action:manipulation}
#${APP_ID} .app{color:var(--ink);width:100%;height:100%}
#${APP_ID} .orb{width:58px;height:58px;border:1px solid rgba(255,255,255,.32);border-radius:17px;background:#242b2e;color:#f6f0e4;box-shadow:0 13px 30px rgba(17,22,24,.35),inset 0 1px rgba(255,255,255,.16);display:grid;place-items:center;cursor:grab;position:relative;transition:transform .18s,box-shadow .18s;padding:0;font:inherit}
#${APP_ID} .orb:hover{transform:translateY(-2px);box-shadow:0 17px 34px rgba(17,22,24,.42),inset 0 1px rgba(255,255,255,.18)}
#${APP_ID} .orb:active{cursor:grabbing}
#${APP_ID} .orb-mark{width:31px;height:31px;border:1px solid #d9c7a3;border-radius:50%;display:grid;place-items:center;font:700 15px Georgia,serif;letter-spacing:-.08em;position:relative}
#${APP_ID} .orb-mark:after{content:"";position:absolute;width:7px;height:7px;background:#bc6252;border:2px solid #242b2e;border-radius:50%;right:-3px;top:0}
#${APP_ID} .orb-badge{position:absolute;right:-5px;bottom:-5px;min-width:21px;height:21px;padding:0 5px;border-radius:11px;background:var(--red);color:white;font:700 11px Consolas,monospace;display:grid;place-items:center;border:2px solid #f4f0e7}
#${APP_ID} .panel{width:100%;height:100%;border:1px solid #a99c86;border-radius:16px;overflow:hidden;background:var(--paper);box-shadow:0 22px 55px rgba(26,30,31,.38);display:grid;grid-template-rows:auto 1fr auto;position:relative}
#${APP_ID} .head{height:61px;padding:0 14px 0 18px;background:#283135;color:#f5f0e7;display:flex;align-items:center;gap:12px;cursor:grab;position:relative;z-index:2}
#${APP_ID} .head:active{cursor:grabbing}
#${APP_ID} .folio{font:700 12px Georgia,serif;color:#d7c49e;border:1px solid #7e7669;border-radius:50%;width:34px;height:34px;display:grid;place-items:center}
#${APP_ID} .title{min-width:0;flex:1}
#${APP_ID} .title strong{display:block;font:700 17px Georgia,"Microsoft YaHei UI",serif;letter-spacing:.08em}
#${APP_ID} .title small{display:block;color:#aeb8bb;font-size:10px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${APP_ID} .icon-btn{width:34px;height:34px;border:0;border-radius:8px;background:transparent;color:#cbd1d2;cursor:pointer}
#${APP_ID} .icon-btn:hover{background:rgba(255,255,255,.1);color:white}
#${APP_ID} .body{overflow-y:auto;overflow-x:hidden;position:relative;z-index:1;padding:17px;scrollbar-color:#a99c86 transparent;overscroll-behavior:contain;min-height:0}
#${APP_ID} .foot{min-height:43px;padding:8px 15px;background:#e8e0d2;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative;z-index:2;font-size:11px;color:var(--muted)}
#${APP_ID} .foot .context{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${APP_ID} .tabs{display:flex;gap:5px;padding:4px;background:#ded5c6;border:1px solid var(--line);border-radius:10px;margin-bottom:16px}
#${APP_ID} .tab{flex:1;border:0;border-radius:7px;background:transparent;padding:8px 6px;color:#596469;font-weight:700;font-size:12px;cursor:pointer}
#${APP_ID} .tab.active{background:#fffaf0;color:var(--ink);box-shadow:0 1px 3px rgba(42,45,42,.15)}
#${APP_ID} .eyebrow{display:flex;align-items:center;gap:8px;color:var(--red);font:700 11px Consolas,"Microsoft YaHei UI",monospace;letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px}
#${APP_ID} .eyebrow:after{content:"";height:1px;flex:1;background:var(--line)}
#${APP_ID} h2{font:700 22px Georgia,"Microsoft YaHei UI",serif;margin:0 0 8px;letter-spacing:.04em}
#${APP_ID} p.lead{margin:0 0 18px;color:var(--muted);font-size:13px;line-height:1.65}
#${APP_ID} .field{margin-bottom:13px}
#${APP_ID} .field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#${APP_ID} .field label,#${APP_ID} .label{display:block;font-size:11px;font-weight:700;color:#556168;margin:0 0 6px;letter-spacing:.03em}
#${APP_ID} .input,#${APP_ID} .textarea,#${APP_ID} .select{width:100%;border:1px solid #bcb19f;border-radius:8px;background:#fffdf7;color:var(--ink);padding:10px 11px;outline:none;transition:border-color .15s,box-shadow .15s}
#${APP_ID} .input,#${APP_ID} .select{height:40px}
#${APP_ID} .textarea{resize:vertical;min-height:88px;line-height:1.55;user-select:text}
#${APP_ID} .input:focus,#${APP_ID} .textarea:focus,#${APP_ID} .select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(50,107,120,.14)}
#${APP_ID} .invalid{border-color:var(--red)!important}
#${APP_ID} .error-text{color:var(--red);font-size:11px;margin-top:5px}
#${APP_ID} .hint{font-size:11px;color:var(--muted);line-height:1.5;margin-top:6px}
#${APP_ID} .notice{border-left:3px solid var(--blue);background:var(--blue-soft);padding:10px 12px;margin:0 0 14px;font-size:12px;line-height:1.5}
#${APP_ID} .notice.error{border-color:var(--red);background:var(--red-soft);color:#74372e}
#${APP_ID} .notice.success{border-color:var(--ok);background:#dce8dc;color:#315b3f}
#${APP_ID} .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
#${APP_ID} .btn{min-height:40px;border-radius:9px;border:1px solid #9e927f;background:#fffaf0;color:var(--ink);padding:0 14px;font-weight:700;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px}
#${APP_ID} .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 10px rgba(46,48,44,.13)}
#${APP_ID} .btn.primary{background:#293438;border-color:#293438;color:white}
#${APP_ID} .btn.accent{background:var(--red);border-color:var(--red);color:white}
#${APP_ID} .btn:disabled{opacity:.48;cursor:not-allowed}
#${APP_ID} .btn.wide{width:100%}
#${APP_ID} .loader{width:15px;height:15px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:${APP_ID}-spin .75s linear infinite}
#${APP_ID} .setting-box{border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:12px;background:rgba(255,253,247,.65)}
#${APP_ID} .param{display:grid;grid-template-columns:1fr 128px;gap:8px;align-items:end;margin-bottom:9px}
#${APP_ID} .param:last-child{margin-bottom:0}
#${APP_ID} .param .field{margin:0}
#${APP_ID} .security{padding:10px;border:1px dashed #b16a59;background:#f1ded6;color:#70433a;border-radius:8px;font-size:11px;line-height:1.5}
#${APP_ID} .cards{display:grid;gap:11px}
#${APP_ID} .card{border:1px solid var(--line);border-left:7px solid #9f9584;border-radius:4px 10px 10px 4px;background:#fffaf1;overflow:hidden}
#${APP_ID} .card.selected{border-left-color:var(--red)}
#${APP_ID} .card.has-error{box-shadow:0 0 0 2px rgba(169,77,63,.2)}
#${APP_ID} .card-head{display:flex;align-items:center;gap:10px;padding:11px 12px;cursor:pointer}
#${APP_ID} .check{width:22px;height:22px;accent-color:var(--red);cursor:pointer}
#${APP_ID} .card-name{min-width:0;flex:1}
#${APP_ID} .card-name strong{display:block;font:700 15px Georgia,"Microsoft YaHei UI",serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${APP_ID} .card-name small{display:block;color:var(--muted);font-size:10px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${APP_ID} .index-tab{background:#ded3bf;color:#645b4e;padding:5px 7px;border-radius:4px;font:700 10px Consolas,monospace}
#${APP_ID} .chevron{color:var(--muted)}
#${APP_ID} .card-body{padding:2px 12px 13px;border-top:1px dashed var(--line)}
#${APP_ID} .card-body .field:first-child{margin-top:12px}
#${APP_ID} .selection-bar{position:sticky;bottom:-17px;margin:15px -17px -17px;padding:11px 17px;background:#f4f0e7;border-top:1px solid var(--line)}
#${APP_ID} .selection-count{font-size:11px;color:var(--muted);margin-bottom:8px}
#${APP_ID} .progress-list{display:grid;gap:9px;margin-top:15px}
#${APP_ID} .progress-item{display:grid;grid-template-columns:28px 1fr;gap:10px;padding:11px;border:1px solid var(--line);border-radius:9px;background:#fffaf1}
#${APP_ID} .status-dot{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#ded7ca;color:#5e686b;font-size:11px;font-weight:700}
#${APP_ID} .status-dot.running{background:var(--blue-soft);color:var(--blue)}
#${APP_ID} .status-dot.success{background:#d9e6db;color:var(--ok)}
#${APP_ID} .status-dot.failed{background:var(--red-soft);color:var(--red)}
#${APP_ID} .progress-item strong{font-size:13px}
#${APP_ID} .progress-item p{font-size:11px;color:var(--muted);margin:4px 0 0;line-height:1.45}
#${APP_ID} .empty{padding:36px 18px;text-align:center;color:var(--muted)}
#${APP_ID} .stamp{width:76px;height:76px;margin:0 auto 14px;border:2px solid var(--ok);border-radius:50%;color:var(--ok);display:grid;place-items:center;transform:rotate(-7deg);font:700 13px Georgia,"Microsoft YaHei UI",serif;letter-spacing:.12em}
#${APP_ID} .kbd-focus:focus-visible,#${APP_ID} button:focus-visible{outline:3px solid rgba(50,107,120,.5);outline-offset:2px}
@keyframes ${APP_ID}-spin{to{transform:rotate(360deg)}}
@media(max-width:390px){#${APP_ID} .body{padding:13px}#${APP_ID} .field-row{grid-template-columns:1fr}#${APP_ID} .param{grid-template-columns:1fr}#${APP_ID} .title strong{font-size:15px}}
@media(prefers-reduced-motion:reduce){#${APP_ID} *,#${APP_ID} *:before,#${APP_ID} *:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || '发生未知错误');
}

class ParseError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ParseError';
    this.details = details;
  }
}

function generationId(prefix) {
  return `${APP_ID}-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSettings(raw) {
  const next = clone(DEFAULT_SETTINGS);
  if (!raw || typeof raw !== 'object') return next;
  for (const key of ['apiurl', 'key', 'model']) {
    if (typeof raw[key] === 'string') next[key] = raw[key];
  }
  for (const def of PARAM_DEFS) {
    const source = raw.params?.[def.key];
    if (!source || typeof source !== 'object') continue;
    if (['same_as_preset', 'unset', 'custom'].includes(source.mode))
      next.params[def.key].mode = source.mode;
    if (typeof source.value === 'string' || typeof source.value === 'number') {
      next.params[def.key].value = String(source.value);
    }
  }
  if (raw.insertion && typeof raw.insertion === 'object') {
    if (
      ['before_character_definition', 'after_character_definition', 'at_depth'].includes(
        raw.insertion.type
      )
    ) {
      next.insertion.type = raw.insertion.type;
    }
    if (typeof raw.insertion.depth === 'number') {
      next.insertion.depth = raw.insertion.depth;
    } else if (typeof raw.insertion.depth === 'string' && !isNaN(Number(raw.insertion.depth))) {
      next.insertion.depth = Number(raw.insertion.depth);
    }
    if (typeof raw.insertion.order === 'number') {
      next.insertion.order = raw.insertion.order;
    } else if (typeof raw.insertion.order === 'string' && !isNaN(Number(raw.insertion.order))) {
      next.insertion.order = Number(raw.insertion.order);
    }
  }
  next.usePersona = Boolean(raw.usePersona);
  next.useWorldInfo = Boolean(raw.useWorldInfo);
  if (typeof raw.useJsonSchema === 'boolean') next.useJsonSchema = raw.useJsonSchema;
  return next;
}

function validateSettings(settings) {
  const errors = {};
  const apiurl = settings.apiurl.trim();
  const model = settings.model.trim();
  try {
    const url = new URL(apiurl);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch (_) {
    errors.apiurl = '请输入有效的 HTTP 或 HTTPS 地址';
  }
  if (!model) errors.model = '模型名称不能为空';
  for (const def of PARAM_DEFS) {
    const param = settings.params[def.key];
    if (param.mode !== 'custom') continue;
    const value = Number(param.value);
    if (param.value === '' || !Number.isFinite(value)) {
      errors[def.key] = '请输入有效数字';
    } else if (value < def.min || value > def.max) {
      errors[def.key] = `允许范围：${def.min} 至 ${def.max}`;
    } else if (def.integer && !Number.isInteger(value)) {
      errors[def.key] = '请输入整数';
    }
  }
  if (settings.insertion.type === 'at_depth') {
    const depth = Number(settings.insertion.depth);
    if (!Number.isInteger(depth) || depth < 0) {
      errors.insertionDepth = '插入深度必须为大于或等于 0 的整数';
    }
  }
  const order = Number(settings.insertion.order);
  if (!Number.isFinite(order)) {
    errors.insertionOrder = '顺序必须为有效数字';
  }
  return errors;
}

function buildCustomApi(settings) {
  const config = {
    apiurl: settings.apiurl.trim(),
    key: settings.key.trim(),
    model: settings.model.trim(),
    source: 'openai',
  };
  for (const def of PARAM_DEFS) {
    const param = settings.params[def.key];
    config[def.key] = param.mode === 'custom' ? Number(param.value) : param.mode;
  }
  return config;
}

function trimCandidate(candidate) {
  return Object.fromEntries(
    CANDIDATE_FIELDS.map(([key]) => [key, String(candidate?.[key] ?? '').trim()])
  );
}

function validateCandidates(candidates) {
  const errors = candidates.map(() => ({}));
  const names = new Map();
  candidates.forEach((candidate, index) => {
    for (const [key, label] of CANDIDATE_FIELDS) {
      if (!String(candidate[key] ?? '').trim()) errors[index][key] = `${label}不能为空`;
    }
    const name = String(candidate.name ?? '').trim();
    if (/[<>\r\n]/.test(name)) errors[index].name = '名字不能包含换行或尖括号';
    if (name) {
      const key = name.toLocaleLowerCase();
      names.set(key, [...(names.get(key) || []), index]);
    }
  });
  for (const duplicateIndexes of names.values()) {
    if (duplicateIndexes.length > 1) {
      duplicateIndexes.forEach(index => {
        errors[index].name = '五个候选的名字不能重复';
      });
    }
  }
  return errors;
}

function hasCandidateErrors(errors) {
  return errors.some(item => Object.keys(item).length > 0);
}

function parseCandidates(raw) {
  if (typeof raw !== 'string') throw new ParseError('候选生成没有返回文本', raw);
  let parsed;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : raw;
    parsed = JSON.parse(jsonStr);
  } catch (_) {
    throw new ParseError('模型返回的候选不是有效 JSON', raw);
  }
  if (!parsed || !Array.isArray(parsed.candidates) || parsed.candidates.length !== 5) {
    throw new ParseError('模型必须返回恰好 5 个候选', raw);
  }
  const candidates = parsed.candidates.map(trimCandidate);
  const errors = validateCandidates(candidates);
  if (hasCandidateErrors(errors))
    throw new ParseError('模型返回的候选字段不完整、名字非法或重复', raw);
  return candidates;
}

function assertString(value, path, rawData) {
  if (typeof value !== 'string' || !value.trim())
    throw new ParseError(`完整角色字段缺失：${path}`, rawData);
  return value.trim();
}

function parseComplete(raw) {
  if (typeof raw !== 'string') throw new ParseError('完整角色生成没有返回文本', raw);
  let data;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : raw;
    data = JSON.parse(jsonStr);
  } catch (_) {
    throw new ParseError('模型返回的完整角色不是有效 JSON', raw);
  }
  const paths = [
    ['basic', 'gender'],
    ['basic', 'race'],
    ['basic', 'age'],
    ['basic', 'height'],
    ['basic', 'cup'],
    ['basic', 'identity'],
    ['background'],
    ['appearance', 'face'],
    ['appearance', 'eyes'],
    ['appearance', 'hair'],
    ['appearance', 'body'],
    ['appearance', 'skin'],
    ['appearance', 'intimateParts'],
    ['sexuality', 'orientation'],
    ['sexuality', 'experience'],
    ['details', 'languageStyle'],
    ['details', 'socialAbility'],
    ['details', 'darkSide'],
    ['details', 'decisionStyle'],
    ['details', 'values', 'priorities'],
    ['details', 'values', 'likes'],
    ['details', 'values', 'dislikes'],
    ['details', 'traits'],
    ['corePersonality', 'definition'],
    ['secondaryPersonality1', 'definition'],
    ['secondaryPersonality2', 'definition'],
    ['secondaryPersonality3', 'definition'],
    ['secondaryPersonality4', 'definition'],
  ];
  for (const path of paths) {
    let value = data;
    for (const key of path) value = value?.[key];
    assertString(value, path.join('.'), raw);
  }
  const personalities = [
    ['corePersonality', 5],
    ['secondaryPersonality1', 4],
    ['secondaryPersonality2', 4],
    ['secondaryPersonality3', 4],
    ['secondaryPersonality4', 4],
  ];
  for (const [key, expectedLength] of personalities) {
    const manifestations = data?.[key]?.manifestations;
    if (!Array.isArray(manifestations) || manifestations.length !== expectedLength) {
      throw new ParseError(
        `完整角色字段 ${key}.manifestations 必须包含恰好 ${expectedLength} 项`,
        raw
      );
    }
    manifestations.forEach((value, index) =>
      assertString(value, `${key}.manifestations.${index}`, raw)
    );
  }
  return data;
}

function block(value, indent = 2) {
  const padding = ' '.repeat(indent);
  return String(value)
    .trim()
    .split(/\r?\n/)
    .map(line => `${padding}${line}`)
    .join('\n');
}

function listBlock(values, indent = 6) {
  const padding = ' '.repeat(indent);
  return values.map(value => `${padding}- ${String(value).trim()}`).join('\n');
}

function formatCompleteCharacter(name, data) {
  const b = data.basic;
  const a = data.appearance;
  const s = data.sexuality;
  const d = data.details;
  const personalities = [
    ['核心性格', data.corePersonality],
    ['次要性格_1', data.secondaryPersonality1],
    ['次要性格_2', data.secondaryPersonality2],
    ['次要性格_3', data.secondaryPersonality3],
    ['次要性格_4', data.secondaryPersonality4],
  ];
  const personalityText = personalities
    .map(
      ([label, personality]) => `  ${label}:
    定义: ${personality.definition.trim()}
    表现:
${listBlock(personality.manifestations)}`
    )
    .join('\n');
  return `<${name}>
${name}:
  基本信息:
    性别: ${b.gender.trim()}
    种族: ${b.race.trim()}
    年龄: ${b.age.trim()}
    身高: ${b.height.trim()}
    罩杯: ${b.cup.trim()}
    身份: ${b.identity.trim()}

  背景故事: |
${block(data.background, 4)}

  外貌:
    面部: ${a.face.trim()}
    眼睛: ${a.eyes.trim()}
    发型发色: |
${block(a.hair, 6)}
    体型身材: ${a.body.trim()}
    肤色: ${a.skin.trim()}
    私密部位: ${a.intimateParts.trim()}

  性相关:
    性取向: ${s.orientation.trim()}
    性经验: ${s.experience.trim()}

  角色细节:
    语言风格: |
${block(d.languageStyle, 6)}
    社交能力: ${d.socialAbility.trim()}
    阴暗面: ${d.darkSide.trim()}
    决策风格: ${d.decisionStyle.trim()}
    价值观:
      重视: ${d.values.priorities.trim()}
      喜好: ${d.values.likes.trim()}
      厌恶: ${d.values.dislikes.trim()}
    特点: |
${block(d.traits, 6)}

${personalityText}
</${name}>`;
}

function candidatePrompt(requirement) {
  return `根据用户的角色需求设计恰好五个明显不同、可继续扩写的角色候选。
要求：
- 使用简体中文；每个字段都必须有具体内容。
- 名字互不重复，不含换行或尖括号。
- 标签简练但有辨识度（将多个标签合并成一个字符串，不要使用数组）；简介能解释角色如何符合需求。
- 必须严格遵循以下 JSON 结构输出，切勿修改键名或结构（不要输出 JSON 以外的其他内容，比如不要加 markdown 的 json 标记，直接输出大括号）：
{
  "candidates": [
    {
      "name": "角色名字",
      "tags": "标签1, 标签2, 标签3...",
      "age": "年龄",
      "appearance": "外貌",
      "bio": "角色简介",
      "quote": "代表性发言"
    }
  ]
}

用户需求：
${requirement.trim()}`;
}

function completePrompt(requirement, candidate) {
  return `将下列已由用户编辑确认的候选扩写为完整角色档案。
规则：
- 使用简体中文，所有字段必须是字符串且有具体内容，不得使用“待定”“略”等占位。
- 严格尊重候选信息，不得修改角色名字。
- 基本信息、外貌、性相关内容应与年龄、种族和整体设定协调；不适用的字段也要给出符合设定的明确说明。
- 背景、角色细节与性格字段要具体、有行为依据，并保持彼此一致。
- corePersonality.manifestations 必须恰好有 5 项；每个 secondaryPersonality 的 manifestations 必须恰好有 4 项，且各性格之间不得重复。
- 必须严格遵循以下 JSON 结构输出，切勿修改键名或结构（不要输出 JSON 以外的其他内容，比如不要加 markdown 的 json 标记，直接输出大括号）：
{
  "basic": { "gender": "", "race": "", "age": "", "height": "", "cup": "", "identity": "" },
  "background": "",
  "appearance": {
    "face": "", "eyes": "", "hair": "", "body": "", "skin": "", "intimateParts": ""
  },
  "sexuality": { "orientation": "", "experience": "" },
  "details": {
    "languageStyle": "", "socialAbility": "", "darkSide": "", "decisionStyle": "",
    "values": { "priorities": "", "likes": "", "dislikes": "" },
    "traits": ""
  },
  "corePersonality": { "definition": "", "manifestations": ["", "", "", "", ""] },
  "secondaryPersonality1": { "definition": "", "manifestations": ["", "", "", ""] },
  "secondaryPersonality2": { "definition": "", "manifestations": ["", "", "", ""] },
  "secondaryPersonality3": { "definition": "", "manifestations": ["", "", "", ""] },
  "secondaryPersonality4": { "definition": "", "manifestations": ["", "", "", ""] }
}

原始需求：
${requirement.trim()}

确认候选：
名字：${candidate.name}
标签：${candidate.tags}
年龄：${candidate.age}
外貌：${candidate.appearance}
简介：${candidate.bio}
代表性发言：${candidate.quote}`;
}

function getPersonaContextText() {
  // If not found in standard variables, we might not have direct access to it via helper in this context,
  // but we can try to extract from current preset if possible, or we just rely on `persona_description` variable if it exists.
  try {
    const vars = getVariables({ type: 'global' });
    const persona = vars?.['persona_description'] || vars?.['user_persona'] || vars?.['persona'];
    if (persona && typeof persona === 'string' && persona.trim()) {
      return persona.trim();
    }
  } catch (e) {
    console.warn('[Character Forge] Failed to get persona from global variables', e);
  }
  return null;
}

function getWorldInfoAndChatContextText() {
  try {
    const vars = getVariables({ type: 'global' });
    const before = vars?.['world_info_before'];
    const after = vars?.['world_info_after'];

    let contextStr = '';
    if (before && typeof before === 'string' && before.trim()) {
      contextStr += `${before.trim()}\n\n`;
    }
    if (after && typeof after === 'string' && after.trim()) {
      contextStr += `${after.trim()}\n\n`;
    }

    if (contextStr) {
      contextStr = `【世界设定】\n${contextStr}`;
    }

    try {
      const messages = getChatMessages(40);
      if (messages && messages.length > 0) {
        const targetMessages = messages.filter(m => m.role === 'assistant' || m.role === 'system');
        if (targetMessages.length > 0) {
          contextStr += `【近期聊天片段】\n`;
          for (const msg of targetMessages.slice(-20)) {
            if (msg.content && msg.content.trim()) {
              const sender = msg.name || (msg.role === 'system' ? 'System' : 'Assistant');
              contextStr += `${sender}: ${msg.content.trim()}\n`;
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Character Forge] Failed to get chat messages', err);
    }

    return contextStr.trim() || null;
  } catch (e) {
    console.warn('[Character Forge] Failed to get world info context', e);
    return null;
  }
}

async function start() {
  let doc, win;
  try {
    doc = parent?.document || document;
    win = parent?.window || window;
  } catch (_) {
    doc = document;
    win = window;
  }

  try {
    win[CLEANUP_KEY]?.();
  } catch (_) {}
  doc.getElementById(APP_ID)?.remove();
  doc.getElementById(`${APP_ID}-style`)?.remove();

  const css = doc.createElement('style');
  css.id = `${APP_ID}-style`;
  css.textContent = styles;
  doc.head.appendChild(css);

  const container = doc.createElement('div');
  container.id = APP_ID;
  const root = doc.createElement('div');
  root.className = 'app';
  container.appendChild(root);
  (doc.documentElement || doc.body).appendChild(container);

  const saved = normalizeSettings(getVariables({ type: 'script' })?.[SETTINGS_KEY]);
  const state = {
    open: false,
    activeTab: 'work',
    scrollPos: { work: 0, settings: 0 },
    stage: 'input',
    requirement: '',
    settings: saved,
    settingsDraft: clone(saved),
    settingsErrors: {},
    models: [],
    modelsLoading: false,
    modelError: '',
    notice: '',
    noticeType: '',
    candidates: [],
    candidateErrors: [],
    expanded: new Set(),
    selected: new Set(),
    context: null,
    batchSettings: null,
    progress: [],
    busy: false,
    errorDetails: null,
  };
  const listeners = [];
  const activeGenerationIds = new Set();
  const orbSize = 58;
  const panelWidth = 430;
  let panelHeight = Math.min(760, Math.max(520, win.innerHeight - 24));
  const position = {
    x: Math.max(8, win.innerWidth - orbSize - 24),
    y: Math.max(8, win.innerHeight - orbSize - 96),
  };
  let drag = null;
  let suppressClick = false;

  function on(target, event, handler, options) {
    if (!target?.addEventListener) return;
    target.addEventListener(event, handler, options);
    listeners.push({ target, event, handler, options });
  }

  function clampPosition(width, height) {
    position.x = Math.max(4, Math.min(position.x, win.innerWidth - width - 4));
    position.y = Math.max(4, Math.min(position.y, win.innerHeight - height - 4));
  }

  function layoutFrame(opening = false) {
    panelHeight = Math.min(760, Math.max(480, win.innerHeight - 16));
    const width = state.open ? Math.min(panelWidth, win.innerWidth - 8) : orbSize;
    const height = state.open ? panelHeight : orbSize;
    if (opening) {
      position.x = Math.min(position.x, win.innerWidth - width - 4);
      position.y = Math.min(position.y, win.innerHeight - height - 4);
    }
    clampPosition(width, height);
    Object.assign(container.style, {
      left: `${Math.round(position.x)}px`,
      top: `${Math.round(position.y)}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
  }

  function currentContext() {
    const characterName = getCurrentCharacterName();
    if (!characterName) throw new Error('当前未打开角色卡，请先进入目标角色卡');
    const worldbookName = getCharWorldbookNames('current')?.primary;
    if (!worldbookName) throw new Error('当前角色卡未绑定主世界书，请先手动绑定后再生成');
    return { characterName, worldbookName };
  }

  function assertContext(expected) {
    const current = currentContext();
    if (
      !expected ||
      current.characterName !== expected.characterName ||
      current.worldbookName !== expected.worldbookName
    ) {
      throw new Error('角色卡或主世界书已发生变化，已停止以避免误写');
    }
    return current;
  }

  function contextLabel() {
    try {
      const context = currentContext();
      return `${context.characterName} · ${context.worldbookName}`;
    } catch (error) {
      return errorMessage(error);
    }
  }

  async function requestStructured(prefix, config, useJsonSchema) {
    const id = generationId(prefix);
    activeGenerationIds.add(id);
    try {
      const { json_schema, ...requestConfig } = config;
      const result = await generateRaw({
        ...requestConfig,
        ...(useJsonSchema ? { json_schema } : {}),
        generation_id: id,
        should_silence: true,
        should_stream: false,
      });
      if (typeof result !== 'string')
        throw new ParseError('模型返回了工具调用而不是结构化文本', JSON.stringify(result, null, 2));
      return result;
    } finally {
      activeGenerationIds.delete(id);
    }
  }

  function renderNotice() {
    if (!state.notice) return '';
    let detailsBtn = '';
    if (state.errorDetails) {
      detailsBtn = ` <button class="btn" style="min-height:24px;padding:0 8px;margin-left:8px;font-size:10px" type="button" data-action="show-error-details">查看原始返回</button>`;
    }
    return `<div class="notice ${escapeHtml(state.noticeType)}" role="status">${escapeHtml(state.notice)}${detailsBtn}</div>`;
  }

  function renderSettings() {
    const s = state.settingsDraft;
    const field = (key, label, type = 'text', extra = '') =>
      `<div class="field"><label for="setting-${key}">${label}</label><input class="input ${state.settingsErrors[key] ? 'invalid' : ''}" id="setting-${key}" data-setting="${key}" type="${type}" value="${escapeHtml(s[key])}" ${extra}>${state.settingsErrors[key] ? `<div class="error-text">${escapeHtml(state.settingsErrors[key])}</div>` : ''}</div>`;
    return `<div class="eyebrow">API / OpenAI compatible</div>
      <h2>连接设置</h2>
      <p class="lead">两个生成阶段共享同一份设置快照。候选生成开始后，本批次不受后续设置修改影响。</p>
      ${renderNotice()}
      <div class="setting-box">
        ${field('apiurl', 'API 地址', 'url', 'placeholder="https://example.com/v1" autocomplete="url"')}
        <div class="field"><label for="setting-key">API Key</label><div style="display:flex;gap:7px"><input class="input" id="setting-key" data-setting="key" type="password" value="${escapeHtml(s.key)}" autocomplete="off" placeholder="sk-…"><button class="btn" type="button" data-action="toggle-key">显示</button></div></div>
        ${field('model', '模型', 'text', 'list="model-options" placeholder="输入或获取模型名称" autocomplete="off"')}
        <datalist id="model-options">${state.models.map(model => `<option value="${escapeHtml(model)}"></option>`).join('')}</datalist>
        <button class="btn wide" type="button" data-action="load-models" ${state.modelsLoading ? 'disabled' : ''}>${state.modelsLoading ? '<span class="loader"></span> 正在获取' : '获取模型列表'}</button>
        ${state.modelError ? `<div class="error-text">${escapeHtml(state.modelError)}</div>` : ''}
      </div>
      <div class="eyebrow">Sampling / advanced</div>
      <div class="setting-box">${PARAM_DEFS.map(def => {
        const param = s.params[def.key];
        return `<div class="param"><div class="field"><label for="mode-${def.key}">${escapeHtml(def.label)}</label><select class="select" id="mode-${def.key}" data-param-mode="${def.key}"><option value="same_as_preset" ${param.mode === 'same_as_preset' ? 'selected' : ''}>沿用预设值</option><option value="unset" ${param.mode === 'unset' ? 'selected' : ''}>不传此参数</option><option value="custom" ${param.mode === 'custom' ? 'selected' : ''}>自定义</option></select></div><div class="field"><label for="value-${def.key}">数值</label><input class="input ${state.settingsErrors[def.key] ? 'invalid' : ''}" id="value-${def.key}" data-param-value="${def.key}" type="number" min="${def.min}" max="${def.max}" step="${def.step}" value="${escapeHtml(param.value)}" ${param.mode !== 'custom' ? 'disabled' : ''}>${state.settingsErrors[def.key] ? `<div class="error-text">${escapeHtml(state.settingsErrors[def.key])}</div>` : ''}</div></div>`;
      }).join('')}</div>
      <div class="eyebrow">Insertion / Worldbook</div>
      <div class="setting-box">
        <div class="field">
          <label for="insertion-type">插入位置</label>
          <select class="select" id="insertion-type" data-insertion="type">
            <option value="before_character_definition" ${s.insertion.type === 'before_character_definition' ? 'selected' : ''}>角色定义前</option>
            <option value="after_character_definition" ${s.insertion.type === 'after_character_definition' ? 'selected' : ''}>角色定义后</option>
            <option value="at_depth" ${s.insertion.type === 'at_depth' ? 'selected' : ''}>系统深度 (@)</option>
          </select>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="insertion-depth">深度（仅选择系统深度时生效）</label>
            <input class="input ${state.settingsErrors.insertionDepth ? 'invalid' : ''}" id="insertion-depth" data-insertion="depth" type="number" value="${escapeHtml(s.insertion.depth)}" ${s.insertion.type !== 'at_depth' ? 'disabled' : ''}>
            ${state.settingsErrors.insertionDepth ? `<div class="error-text">${escapeHtml(state.settingsErrors.insertionDepth)}</div>` : ''}
          </div>
          <div class="field">
            <label for="insertion-order">顺序 (Order)</label>
            <input class="input ${state.settingsErrors.insertionOrder ? 'invalid' : ''}" id="insertion-order" data-insertion="order" type="number" value="${escapeHtml(s.insertion.order)}">
            ${state.settingsErrors.insertionOrder ? `<div class="error-text">${escapeHtml(state.settingsErrors.insertionOrder)}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="eyebrow">Context Generation</div>
      <div class="setting-box">
        <div class="field" style="display:flex;align-items:center;gap:8px;margin:0 0 10px 0">
          <input type="checkbox" id="setting-use-persona" class="check" data-setting-checkbox="usePersona" ${s.usePersona ? 'checked' : ''}>
          <label for="setting-use-persona" style="margin:0;cursor:pointer">生成时携带用户设定 (Persona)</label>
        </div>
        <div class="hint" style="margin-top:0;margin-bottom:12px">开启后将在提供给模型的上下文中加入当前选择的用户设定信息，以生成更符合互动倾向的角色。如果当前用户设定为空则无效。</div>
        
        <div class="field" style="display:flex;align-items:center;gap:8px;margin:0">
          <input type="checkbox" id="setting-use-worldinfo" class="check" data-setting-checkbox="useWorldInfo" ${s.useWorldInfo ? 'checked' : ''}>
          <label for="setting-use-worldinfo" style="margin:0;cursor:pointer">生成时携带世界信息及近期聊天</label>
        </div>
        <div class="hint" style="margin-top:6px;margin-bottom:0">开启后将在提供给模型的上下文中加入角色定义前后的世界信息（World Info），以及最新 20 条助手或系统聊天记录。如果为空则不添加。</div>
      </div>
      <div class="eyebrow">Structured Output</div>
      <div class="setting-box">
        <div class="field" style="display:flex;align-items:center;gap:8px;margin:0">
          <input type="checkbox" id="setting-use-json-schema" class="check" data-setting-checkbox="useJsonSchema" ${s.useJsonSchema ? 'checked' : ''}>
          <label for="setting-use-json-schema" style="margin:0;cursor:pointer">使用 JSON Schema 约束输出</label>
        </div>
        <div class="hint" style="margin-top:6px;margin-bottom:0">推荐支持结构化输出的模型开启。若接口或模型不支持 <code>json_schema</code>，请关闭；关闭后仍会通过提示词要求模型输出 JSON，并在本地校验结果。</div>
      </div>
      <div class="security">API Key 将与其他设置一起保存到当前脚本变量中，可被有权读取脚本配置的代码访问。请勿在不受信任的脚本环境中保存敏感密钥。</div>
      <div class="actions"><button class="btn primary" type="button" data-action="save-settings">保存设置</button><button class="btn" type="button" data-action="reset-settings">恢复默认</button></div>`;
  }

  function renderInput() {
    return `<div class="eyebrow">Brief / character request</div><h2>建立角色档案</h2><p class="lead">描述世界观、身份、关系或你想保留的矛盾。先生成五份候选档案，再选择 1–5 位写入主世界书。</p>${renderNotice()}<div class="field"><label for="requirement">角色需求</label><textarea id="requirement" class="textarea" data-state="requirement" style="min-height:190px" placeholder="例如：现代海滨城市，设计一位经营旧唱片店、与主角有未解旧事的成年女性角色……">${escapeHtml(state.requirement)}</textarea><div class="hint">请求不会携带当前预设、聊天历史或角色定义。</div></div><button class="btn accent wide" type="button" data-action="generate-candidates" ${state.busy ? 'disabled' : ''}>${state.busy ? '<span class="loader"></span> 正在整理候选档案' : '生成 5 个候选'}</button>`;
  }

  function renderCandidateCard(candidate, index) {
    const selected = state.selected.has(index);
    const expanded = state.expanded.has(index);
    const errors = state.candidateErrors[index] || {};
    return `<section class="card ${selected ? 'selected' : ''} ${Object.keys(errors).length ? 'has-error' : ''}" data-card="${index}"><div class="card-head" data-action="toggle-card" data-index="${index}"><input class="check" type="checkbox" data-select="${index}" aria-label="选择 ${escapeHtml(candidate.name)}" ${selected ? 'checked' : ''} ${state.busy ? 'disabled' : ''}><div class="card-name"><strong>${escapeHtml(candidate.name || `候选 ${index + 1}`)}</strong><small>${escapeHtml(candidate.tags || '等待补充标签')}</small></div><span class="index-tab">档案 ${String(index + 1).padStart(2, '0')}</span><span class="chevron">${expanded ? '▲' : '▼'}</span></div>${expanded ? `<div class="card-body">${CANDIDATE_FIELDS.map(([key, label, type]) => `<div class="field"><label for="candidate-${index}-${key}">${label}</label>${type === 'textarea' ? `<textarea class="textarea ${errors[key] ? 'invalid' : ''}" id="candidate-${index}-${key}" data-candidate="${index}" data-field="${key}" ${state.busy ? 'disabled' : ''}>${escapeHtml(candidate[key])}</textarea>` : `<input class="input ${errors[key] ? 'invalid' : ''}" id="candidate-${index}-${key}" data-candidate="${index}" data-field="${key}" value="${escapeHtml(candidate[key])}" ${state.busy ? 'disabled' : ''}>`}${errors[key] ? `<div class="error-text">${escapeHtml(errors[key])}</div>` : ''}</div>`).join('')}</div>` : ''}</section>`;
  }

  function renderCandidates() {
    return `<div class="eyebrow">Index / five drafts</div><h2>选择候选档案</h2><p class="lead">所有字段均可直接修订。确认前会检查五份档案；最终角色名以这里的编辑值为准。</p>${renderNotice()}<div class="cards">${state.candidates.map(renderCandidateCard).join('')}</div><div class="selection-bar"><div class="selection-count">已选择 ${state.selected.size} / 5（至少选择 1 位）</div><div class="actions" style="margin:0"><button class="btn accent" style="flex:1" type="button" data-action="generate-complete" ${state.busy || state.selected.size < 1 || state.selected.size > 5 ? 'disabled' : ''}>生成完整档案并写入</button><button class="btn" type="button" data-action="generate-candidates" ${state.busy ? 'disabled' : ''}>重抽候选</button></div></div>`;
  }

  function renderProgress() {
    const complete = state.stage === 'done';
    return `<div class="eyebrow">${complete ? 'Filed / complete' : 'Processing / serial queue'}</div><h2>${complete ? '归档结果' : '正在逐份归档'}</h2><p class="lead">${complete ? '已完成本批次。成功档案已写入绑定的主世界书。' : '角色将按选择顺序依次生成，成功一份便立即写入一份。关闭面板不会中断任务。'}</p>${renderNotice()}${complete ? '<div class="stamp">已归档</div>' : ''}<div class="progress-list">${state.progress.map((item, index) => `<div class="progress-item"><span class="status-dot ${item.status}">${item.status === 'running' ? '…' : item.status === 'success' ? '✓' : item.status === 'failed' ? '!' : index + 1}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.message)}</p></div></div>`).join('')}</div>${complete ? '<div class="actions"><button class="btn primary wide" type="button" data-action="restart">开始新一批</button></div>' : ''}`;
  }

  function renderWork() {
    if (state.stage === 'input') return renderInput();
    if (state.stage === 'candidates') return renderCandidates();
    return renderProgress();
  }

  function render() {
    let currentScroll = 0;
    const bodyEl = root.querySelector('.body');
    if (bodyEl) {
      currentScroll = bodyEl.scrollTop;
      state.scrollPos[state.activeTab] = currentScroll;
    }

    layoutFrame();
    if (!state.open) {
      root.innerHTML = `<button class="orb" type="button" data-action="open" aria-label="打开角色档案生成器"><span class="orb-mark">CF</span>${state.selected.size ? `<span class="orb-badge">${state.selected.size}</span>` : ''}</button>`;
      return;
    }
    root.innerHTML = `<div class="panel"><header class="head" data-drag-handle><span class="folio">CF</span><div class="title"><strong>角色档案工作台</strong><small>CHARACTER FOLIO</small></div><button class="icon-btn" type="button" data-action="close" aria-label="折叠面板">—</button></header><main class="body"><nav class="tabs" aria-label="工作台页面"><button class="tab ${state.activeTab === 'work' ? 'active' : ''}" type="button" data-tab="work">工作台</button><button class="tab ${state.activeTab === 'settings' ? 'active' : ''}" type="button" data-tab="settings">设置</button></nav>${state.activeTab === 'settings' ? renderSettings() : renderWork()}</main><footer class="foot"><span class="context" title="${escapeHtml(contextLabel())}">${escapeHtml(contextLabel())}</span><span>本批次 ${state.batchSettings ? '已锁定' : '未开始'}</span></footer></div>`;

    const newBodyEl = root.querySelector('.body');
    if (newBodyEl) {
      newBodyEl.scrollTop = state.scrollPos[state.activeTab] || 0;
    }
  }

  function updateCandidate(index, key, value) {
    if (!state.candidates[index]) return;
    state.candidates[index][key] = value;
    if (state.candidateErrors[index]) delete state.candidateErrors[index][key];
  }

  function firstCandidateErrorFocus() {
    const firstIndex = state.candidateErrors.findIndex(item => Object.keys(item || {}).length > 0);
    if (firstIndex < 0) return;
    state.expanded.add(firstIndex);
    const firstKey = Object.keys(state.candidateErrors[firstIndex])[0];
    render();
    win.requestAnimationFrame(() =>
      root.querySelector(`#candidate-${firstIndex}-${firstKey}`)?.focus()
    );
  }

  async function generateCandidates() {
    const requirement = state.requirement.trim();
    if (!requirement) {
      state.notice = '请先填写角色需求。';
      state.noticeType = 'error';
      render();
      return;
    }
    const errors = validateSettings(state.settings);
    if (Object.keys(errors).length) {
      state.settingsDraft = clone(state.settings);
      state.settingsErrors = errors;
      state.notice = 'API 设置尚未完成，请修正后再生成。';
      state.noticeType = 'error';
      state.activeTab = 'settings';
      render();
      return;
    }
    let context;
    try {
      context = currentContext();
    } catch (error) {
      state.notice = errorMessage(error);
      state.noticeType = 'error';
      render();
      return;
    }
    state.busy = true;
    state.notice = '';
    state.noticeType = '';
    state.errorDetails = null;
    render();
    const snapshot = clone(state.settings);

    const sysPromptLines = [
      '你是角色设定编辑。只根据用户明确提供的需求创建角色候选，不调用任何聊天上下文、预设或角色定义。',
    ];
    if (snapshot.usePersona) {
      const p = getPersonaContextText();
      if (p) {
        sysPromptLines.push(
          `用户的个人设定(Persona)为：\n${p}\n如果合适，你可以参考该设定来生成能与之互动的角色。`
        );
      }
    }
    if (snapshot.useWorldInfo) {
      const w = getWorldInfoAndChatContextText();
      if (w) {
        sysPromptLines.push(
          `当前世界信息与近期聊天背景：\n${w}\n如果合适，你可以参考这些背景信息，让生成的角色符合当前世界观和互动氛围。`
        );
      }
    }

    try {
      const raw = await requestStructured(
        'candidates',
        {
          ordered_prompts: [
            {
              role: 'system',
              content: sysPromptLines.join('\n\n'),
            },
            { role: 'user', content: candidatePrompt(requirement) },
          ],
          json_schema: candidateSchema,
          custom_api: buildCustomApi(snapshot),
        },
        snapshot.useJsonSchema
      );
      assertContext(context);
      state.candidates = parseCandidates(raw);
      state.candidateErrors = state.candidates.map(() => ({}));
      state.expanded = new Set([0]);
      state.selected = new Set();
      state.context = context;
      state.batchSettings = snapshot;
      state.stage = 'candidates';
      state.notice = '候选已生成。可编辑全部字段后选择 1–5 位。';
      state.noticeType = 'success';
    } catch (error) {
      state.notice = errorMessage(error);
      state.noticeType = 'error';
      if (error && error.name === 'ParseError') {
        state.errorDetails = error.details;
      }
    } finally {
      state.busy = false;
      render();
    }
  }

  async function saveCharacter(context, name, content) {
    assertContext(context);
    const entries = await getWorldbook(context.worldbookName);
    const matches = entries.filter(entry => entry.name.trim() === name);
    assertContext(context);
    const insertionSettings = state.batchSettings
      ? state.batchSettings.insertion
      : state.settings.insertion;

    const position = {
      type: insertionSettings.type,
      order: Number(insertionSettings.order),
    };
    if (position.type === 'at_depth') {
      position.role = 'system';
      position.depth = Number(insertionSettings.depth);
    }

    if (!matches.length) {
      await createWorldbookEntries(
        context.worldbookName,
        [
          {
            name,
            content,
            enabled: true,
            strategy: {
              type: 'selective',
              keys: [name],
              keys_secondary: { logic: 'and_any', keys: [] },
              scan_depth: 'same_as_global',
            },
            position,
            probability: 100,
            recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
            effect: { sticky: null, cooldown: null, delay: null },
          },
        ],
        { render: 'immediate' }
      );
      return '已新增到主世界书';
    }
    const keepUid = matches[0].uid;
    await updateWorldbookWith(
      context.worldbookName,
      worldbook =>
        worldbook
          .filter(entry => entry.name.trim() !== name || entry.uid === keepUid)
          .map(entry =>
            entry.uid === keepUid
              ? {
                  ...entry,
                  name,
                  content,
                  enabled: true,
                  strategy: {
                    ...entry.strategy,
                    type: 'selective',
                    keys: [name],
                    keys_secondary: {
                      ...entry.strategy.keys_secondary,
                      logic: 'and_any',
                      keys: [],
                    },
                  },
                  position,
                  recursion: {
                    ...entry.recursion,
                    prevent_incoming: true,
                    prevent_outgoing: true,
                  },
                }
              : entry
          ),
      { render: 'immediate' }
    );
    return matches.length > 1 ? `已覆盖并归并 ${matches.length} 条同名档案` : '已覆盖同名档案';
  }

  async function generateComplete() {
    state.candidates = state.candidates.map(trimCandidate);
    state.candidateErrors = validateCandidates(state.candidates);
    if (hasCandidateErrors(state.candidateErrors)) {
      state.notice = '请先修正候选档案中的字段错误。';
      state.noticeType = 'error';
      firstCandidateErrorFocus();
      return;
    }
    if (state.selected.size < 1 || state.selected.size > 5) {
      state.notice = '请选择 1–5 位候选。';
      state.noticeType = 'error';
      render();
      return;
    }
    try {
      assertContext(state.context);
    } catch (error) {
      state.notice = errorMessage(error);
      state.noticeType = 'error';
      render();
      return;
    }
    const selectedCandidates = [...state.selected]
      .sort((a, b) => a - b)
      .map(index => clone(state.candidates[index]));
    state.progress = selectedCandidates.map(candidate => ({
      name: candidate.name,
      status: 'waiting',
      message: '等待生成',
    }));
    state.stage = 'running';
    state.busy = true;
    state.notice = '';
    state.noticeType = '';
    state.errorDetails = null;
    state.activeTab = 'work';
    render();
    let contextBroken = false;
    for (let index = 0; index < selectedCandidates.length; index += 1) {
      const candidate = selectedCandidates[index];
      const item = state.progress[index];
      if (contextBroken) {
        item.status = 'failed';
        item.message = '因上下文变化而跳过';
        render();
        continue;
      }
      item.status = 'running';
      item.message = '正在生成完整档案';
      render();
      try {
        assertContext(state.context);

        const sysPromptLines = [
          '你是严谨的角色档案编辑。请把用户确认的候选扩写为内部一致、字段完整的角色资料，不调用任何聊天上下文、预设或角色定义。',
        ];
        if (state.batchSettings?.usePersona) {
          const p = getPersonaContextText();
          if (p) {
            sysPromptLines.push(
              `用户的个人设定(Persona)为：\n${p}\n请确保生成的角色可以和这个设定自然共存和互动。`
            );
          }
        }
        if (state.batchSettings?.useWorldInfo) {
          const w = getWorldInfoAndChatContextText();
          if (w) {
            sysPromptLines.push(
              `当前世界信息与近期聊天背景：\n${w}\n请确保生成的角色可以和这个世界观及互动氛围自然融合。`
            );
          }
        }

        const raw = await requestStructured(
          `complete-${index}`,
          {
            ordered_prompts: [
              {
                role: 'system',
                content: sysPromptLines.join('\n\n'),
              },
              { role: 'user', content: completePrompt(state.requirement, candidate) },
            ],
            json_schema: completeSchema,
            custom_api: buildCustomApi(state.batchSettings),
          },
          state.batchSettings.useJsonSchema
        );
        assertContext(state.context);
        const data = parseComplete(raw);
        const content = formatCompleteCharacter(candidate.name, data);
        item.message = '生成完成，正在写入主世界书';
        render();
        const result = await saveCharacter(state.context, candidate.name, content);
        item.status = 'success';
        item.message = result;
      } catch (error) {
        item.status = 'failed';
        item.message = errorMessage(error);
        if (error && error.name === 'ParseError') {
          state.errorDetails = error.details;
        }
        if (/角色卡或主世界书已发生变化|当前未打开角色卡|未绑定主世界书/.test(item.message))
          contextBroken = true;
      }
      render();
    }
    const successes = state.progress.filter(item => item.status === 'success').length;
    const failures = state.progress.length - successes;
    state.stage = 'done';
    state.busy = false;
    state.notice = `完成：${successes} 份写入成功${failures ? `，${failures} 份失败` : ''}。`;
    state.noticeType = failures ? 'error' : 'success';
    render();
  }

  async function loadModels() {
    const apiurl = state.settingsDraft.apiurl.trim();
    try {
      const url = new URL(apiurl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch (_) {
      state.modelError = '请先填写有效的 API 地址';
      render();
      return;
    }
    state.modelsLoading = true;
    state.modelError = '';
    render();
    try {
      const models = await getModelList({ apiurl, key: state.settingsDraft.key.trim() });
      state.models = [
        ...new Set(
          models.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim())
        ),
      ].sort((a, b) => a.localeCompare(b));
      if (!state.models.length) state.modelError = '接口返回的模型列表为空，仍可手动填写模型';
    } catch (error) {
      state.modelError = `获取失败：${errorMessage(error)}`;
    } finally {
      state.modelsLoading = false;
      render();
    }
  }

  function saveSettings() {
    state.settingsErrors = validateSettings(state.settingsDraft);
    if (Object.keys(state.settingsErrors).length) {
      state.notice = '设置中存在无效字段。';
      state.noticeType = 'error';
      render();
      return;
    }
    state.settings = normalizeSettings(state.settingsDraft);
    insertOrAssignVariables({ [SETTINGS_KEY]: clone(state.settings) }, { type: 'script' });
    state.notice = state.batchSettings
      ? '设置已保存，将从下一批候选生成开始生效。'
      : '设置已保存。';
    state.noticeType = 'success';
    render();
  }

  function restart() {
    state.stage = 'input';
    state.candidates = [];
    state.candidateErrors = [];
    state.expanded = new Set();
    state.selected = new Set();
    state.progress = [];
    state.context = null;
    state.batchSettings = null;
    state.notice = '';
    state.noticeType = '';
    state.errorDetails = null;
    render();
  }

  on(root, 'input', event => {
    const target = event.target;
    if (!(target instanceof win.HTMLInputElement || target instanceof win.HTMLTextAreaElement))
      return;
    if (target.dataset.state === 'requirement') state.requirement = target.value;
    if (target.dataset.setting) {
      state.settingsDraft[target.dataset.setting] = target.value;
      delete state.settingsErrors[target.dataset.setting];
    }
    if (target.dataset.paramValue) {
      state.settingsDraft.params[target.dataset.paramValue].value = target.value;
      delete state.settingsErrors[target.dataset.paramValue];
    }
    if (target.dataset.insertion) {
      state.settingsDraft.insertion[target.dataset.insertion] = target.value;
      delete state.settingsErrors.insertionDepth;
      delete state.settingsErrors.insertionOrder;
    }
    if (target.dataset.candidate)
      updateCandidate(Number(target.dataset.candidate), target.dataset.field, target.value);
  });

  on(root, 'change', event => {
    const target = event.target;
    if (!(target instanceof win.HTMLSelectElement || target instanceof win.HTMLInputElement))
      return;
    if (target.dataset.paramMode) {
      state.settingsDraft.params[target.dataset.paramMode].mode = target.value;
      render();
    }
    if (target.dataset.insertion === 'type') {
      state.settingsDraft.insertion.type = target.value;
      render();
    }
    if (target.dataset.settingCheckbox) {
      state.settingsDraft[target.dataset.settingCheckbox] = target.checked;
      render();
    }
    if (target.dataset.select) {
      const index = Number(target.dataset.select);
      if (target.checked && state.selected.size >= 5) {
        target.checked = false;
        state.notice = '最多选择 5 位候选。';
        state.noticeType = 'error';
        render();
        return;
      }
      if (target.checked) state.selected.add(index);
      else state.selected.delete(index);
      render();
    }
  });

  on(root, 'click', event => {
    const button = event.target.closest('[data-action],[data-tab]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'open') {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      state.open = true;
      layoutFrame(true);
      render();
    } else if (action === 'close') {
      state.open = false;
      render();
    } else if (action === 'toggle-card' && !event.target.closest('[data-select]')) {
      const index = Number(button.dataset.index);
      if (state.expanded.has(index)) state.expanded.delete(index);
      else state.expanded.add(index);
      render();
    } else if (action === 'generate-candidates') generateCandidates();
    else if (action === 'generate-complete') generateComplete();
    else if (action === 'load-models') loadModels();
    else if (action === 'save-settings') saveSettings();
    else if (action === 'reset-settings') {
      state.settingsDraft = clone(DEFAULT_SETTINGS);
      state.settingsErrors = {};
      state.modelError = '';
      state.notice = '已恢复默认值，点击“保存设置”后生效。';
      state.noticeType = '';
      render();
    } else if (action === 'toggle-key') {
      const input = root.querySelector('#setting-key');
      input.type = input.type === 'password' ? 'text' : 'password';
      button.textContent = input.type === 'password' ? '显示' : '隐藏';
    } else if (action === 'restart') restart();
    else if (action === 'show-error-details') {
      if (state.errorDetails) {
        console.error('[Character Forge] 原始模型返回:', state.errorDetails);
        try {
          const w = win.open('', '_blank');
          if (w) {
            w.document.write(
              `<!DOCTYPE html><html><head><title>模型返回详情</title><style>body{font-family:monospace;padding:20px;background:#1e1e1e;color:#d4d4d4;white-space:pre-wrap;word-wrap:break-word;}</style></head><body>${escapeHtml(state.errorDetails)}</body></html>`
            );
            w.document.close();
          } else {
            win.alert('弹出窗口被拦截，已打印在控制台');
          }
        } catch (_) {
          win.alert('无法打开新窗口，请查看浏览器控制台 (F12)');
        }
      }
    }
    if (button.dataset.tab) {
      state.activeTab = button.dataset.tab;
      state.notice = '';
      state.noticeType = '';
      if (state.activeTab === 'settings') state.settingsDraft = clone(state.settings);
      render();
    }
  });

  on(root, 'pointerdown', event => {
    const handle = event.target.closest('[data-drag-handle],.orb');
    if (!handle || event.target.closest('button.icon-btn')) return;
    drag = {
      id: event.pointerId,
      startX: event.screenX,
      startY: event.screenY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    handle.setPointerCapture?.(event.pointerId);
  });
  on(root, 'pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.screenX - drag.startX;
    const dy = event.screenY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    position.x = drag.originX + dx;
    position.y = drag.originY + dy;
    layoutFrame();
    event.preventDefault();
  });
  on(root, 'pointerup', event => {
    if (!drag || drag.id !== event.pointerId) return;
    suppressClick = drag.moved;
    drag = null;
  });
  on(win, 'resize', () => {
    layoutFrame();
  });

  let cleaned = false;
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    for (const id of activeGenerationIds) {
      try {
        stopGenerationById(id);
      } catch (_) {}
    }
    activeGenerationIds.clear();
    while (listeners.length) {
      const { target, event, handler, options } = listeners.pop();
      try {
        target.removeEventListener(event, handler, options);
      } catch (_) {}
    }
    doc.getElementById(APP_ID)?.remove();
    doc.getElementById(`${APP_ID}-style`)?.remove();
    if (win[CLEANUP_KEY] === cleanup) {
      try {
        delete win[CLEANUP_KEY];
      } catch (_) {
        win[CLEANUP_KEY] = undefined;
      }
    }
  }
  win[CLEANUP_KEY] = cleanup;
  on(win, 'pagehide', cleanup);
  on(win, 'unload', cleanup);
  try {
    if (window !== win) {
      on(window, 'pagehide', cleanup);
      on(window, 'unload', cleanup);
    }
  } catch (_) {}

  layoutFrame();
  render();
}

function ready(callback) {
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  else callback();
}

ready(() => {
  start().catch(error => {
    console.error('[Character Forge]', error);
    try {
      toastr.error(errorMessage(error), '角色档案生成器');
    } catch (_) {}
  });
});
