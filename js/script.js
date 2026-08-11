
(function () {
    const mainCanvas = document.getElementById('mainCanvas');
    const ctx = mainCanvas.getContext('2d');
    const previewWrapper = document.getElementById('previewWrapper');
    const previewHint = document.getElementById('previewHint');
    const layerListEl = document.getElementById('layerList');
    const propsBody = document.getElementById('propsBody');
    const toastEl = document.getElementById('toast');
    const imageFileInput = document.getElementById('imageFileInput');
    const projectFileInput = document.getElementById('projectFileInput');
    const templateFileInput = document.getElementById('templateFileInput');
    const tempTemplateFileInput = document.getElementById('tempTemplateFileInput');
    const previewArea = document.getElementById('previewArea');
    const sidebar = document.getElementById('sidebar');
    const presetBgContainer = document.getElementById('presetBgContainer');
    const templatePresetList = document.getElementById('templatePresetList');
    const welcomeModalOverlay = document.getElementById('welcomeModalOverlay');
    const tutorialModalOverlay = document.getElementById('tutorialModalOverlay');
    const aboutModalOverlay = document.getElementById('aboutModalOverlay');
    const presetBgModalOverlay = document.getElementById('presetBgModalOverlay');
    const customTemplateModalOverlay = document.getElementById('customTemplateModalOverlay');
    const confirmModalOverlay = document.getElementById('confirmModalOverlay');
    const confirmModalTitle = document.getElementById('confirmModalTitle');
    const confirmModalMessage = document.getElementById('confirmModalMessage');
    const confirmModalCancelBtn = document.getElementById('confirmModalCancelBtn');
    const confirmModalConfirmBtn = document.getElementById('confirmModalConfirmBtn');
    const presetBgEditList = document.getElementById('presetBgEditList');
    const customTemplateNameInput = document.getElementById('customTemplateName');
    const configFileInput = document.getElementById('configFileInput');
    const faqModalOverlay = document.getElementById('faqModalOverlay');
    const addPresetBgModalOverlay = document.getElementById('addPresetBgModalOverlay');
    const fontListModalOverlay = document.getElementById('fontListModalOverlay');
    const addFontModalOverlay = document.getElementById('addFontModalOverlay');
    const fontEditList = document.getElementById('fontEditList');

    // CONFIG 默认配置
    const CONFIG = {
        version: '1.0',
        defaults: {
            ratio: '16:9',
            quality: 'hd',
            bgType: 'solid',
            bgColor: '#1a1a2e',
            bgGradColor1: '#4f6ef7',
            bgGradColor2: '#a855f7',
            bgGradDirection: 'top-bottom',
            darkMode: true,
            sidebarCollapsed: false,
            persistenceEnabled: true,
            allowOutOfBounds: false,
            alwaysFreeSelect: true,
            showBuiltinTemplates: true,
            showBuiltinFonts: true,
            resizeHandlesEnabled: true,
            previewZoom: 1,
            watermarkEnabled: false,
            watermarkText: 'Watermark',
            watermarkColor: '#ffffff',
            watermarkOpacity: 0.3,
            watermarkFontSize: 36,
            watermarkFontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
            watermarkPosition: 'tile',
            watermarkRotation: -30,
            watermarkGapX: 35,
            watermarkGapY: 30,
        },
        qualityMap: { 'sd': 720, 'hd': 1080, 'fhd': 1440, '4k': 2160 },
        ratioMap: {
            '1:1': [1, 1], '3:4': [3, 4], '4:3': [4, 3], '9:16': [9, 16],
            '16:9': [16, 9], '9:21': [9, 21], '21:9': [21, 9], '1:2': [1, 2], '2:1': [2, 1],
        },
        presetBgs: [
            { type: 'solid', color: '#1a1a2e', label: '深黑' },
            { type: 'solid', color: '#ffffff', label: '纯白' },
            { type: 'solid', color: '#0f172a', label: '暗蓝' },
            { type: 'gradient', c1: '#4f6ef7', c2: '#a855f7', dir: 'tl-br', label: '紫蓝渐变' },
            { type: 'gradient', c1: '#10b981', c2: '#06b6d4', dir: 'top-bottom', label: '青绿渐变' },
        ],
        fonts: [
            { label: '苹方/微软雅黑', value: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif' },
            { label: '微软雅黑', value: 'Microsoft YaHei, PingFang SC, sans-serif' },
            { label: '苹方/黑体', value: 'PingFang SC, Hiragino Sans GB, sans-serif' },
            { label: '思源黑体', value: 'Noto Sans SC, Microsoft YaHei, sans-serif' },
            { label: '黑体', value: 'SimHei, Heiti SC, sans-serif' },
            { label: '楷体', value: 'KaiTi, STKaiti, serif' },
            { label: '宋体', value: 'SimSun, STSong, serif' },
            { label: 'Georgia 衬线', value: 'Georgia, serif' },
            { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
            { label: 'Helvetica Neue', value: 'Helvetica Neue, Arial, sans-serif' },
            { label: 'Roboto', value: 'Roboto, sans-serif' },
            { label: 'Montserrat', value: 'Montserrat, sans-serif' },
            { label: 'Impact', value: 'Impact, sans-serif' },
        ],
        fontWeights: [
            { value: '300', label: '细体' }, { value: 'normal', label: '常规' },
            { value: 'bold', label: '粗体' }, { value: '900', label: '特粗' },
        ],
        textLayerDefaults: {
            fontSize: 64, color: '#ffffff',
            fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif',
            fontWeight: 'bold', textAlign: 'center', letterSpacing: 0, lineHeight: 1.3,
            shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2,
        },
        imageLayerDefaults: { widthPct: 30, originalWidth: 800, originalHeight: 600, blur: 0, rotation: 0 },
        templates: {
            techBlue: {
                name: '科技蓝',
                bgType: 'solid',
                bgColor: '#0f172a',
                layers: [
                    { type: 'text', name: '主标题', content: '软件名称', xPct: 50, yPct: 26, fontSize: 76, color: '#ffffff', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: 2, lineHeight: 1.3, shadowEnabled: true, shadowColor: '#3b82f6', shadowBlur: 20, shadowOffsetX: 0, shadowOffsetY: 0, visible: true },
                    { type: 'text', name: '副标题', content: '核心卖点一句话描述', xPct: 50, yPct: 40, fontSize: 38, color: '#93c5fd', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 1, lineHeight: 1.4, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true },
                    { type: 'text', name: '底部信息', content: '官网地址 | 版权所有', xPct: 50, yPct: 88, fontSize: 22, color: '#64748b', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 0, lineHeight: 1.3, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true }
                ]
            },
            minimalWhite: {
                name: '简约白',
                bgType: 'solid',
                bgColor: '#ffffff',
                layers: [
                    { type: 'text', name: '主标题', content: '产品名称', xPct: 50, yPct: 30, fontSize: 68, color: '#1a1a2e', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: 0, lineHeight: 1.3, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true },
                    { type: 'text', name: '副标题', content: '简洁高效的产品描述', xPct: 50, yPct: 43, fontSize: 34, color: '#5a5f6e', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 0, lineHeight: 1.4, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true },
                    { type: 'text', name: '底部信息', content: '官方网站 | 联系方式', xPct: 50, yPct: 87, fontSize: 20, color: '#999999', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 0, lineHeight: 1.3, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true }
                ]
            },
            darkGold: {
                name: '暗黑金',
                bgType: 'solid',
                bgColor: '#0a0a0a',
                layers: [
                    { type: 'text', name: '主标题', content: 'PREMIUM', xPct: 50, yPct: 25, fontSize: 72, color: '#d4a853', fontFamily: 'Georgia, serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: 8, lineHeight: 1.3, shadowEnabled: true, shadowColor: '#d4a853', shadowBlur: 25, shadowOffsetX: 0, shadowOffsetY: 0, visible: true },
                    { type: 'text', name: '副标题', content: '高端品质之选', xPct: 50, yPct: 42, fontSize: 34, color: '#c0c0c0', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 3, lineHeight: 1.4, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true },
                    { type: 'text', name: '底部信息', content: '享受每一刻 | 匠心打造', xPct: 50, yPct: 87, fontSize: 20, color: '#888888', fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', fontWeight: 'normal', textAlign: 'center', letterSpacing: 1, lineHeight: 1.3, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, visible: true }
                ]
            }
        },
        _loaded: false,
    };

    // 运行时可变数据
    let presetBgs = [];
    let customTemplates = [];
    let customFonts = [];

    // 通用图层解析

    // 从持久化模板数据中解析单个图层 返回完整图层对象
    function parseLayerData(layerData) {
        if (layerData.type === 'text') {
            const tld = CONFIG.textLayerDefaults;
            const layer = createTextLayer(
                layerData.name, layerData.content, layerData.xPct, layerData.yPct,
                layerData.fontSize ?? tld.fontSize,
                layerData.color ?? tld.color,
                layerData.fontFamily ?? tld.fontFamily,
                layerData.fontWeight ?? tld.fontWeight
            );
            layer.textAlign = layerData.textAlign ?? tld.textAlign;
            layer.letterSpacing = layerData.letterSpacing ?? tld.letterSpacing;
            layer.lineHeight = layerData.lineHeight ?? tld.lineHeight;
            layer.shadowEnabled = layerData.shadowEnabled ?? tld.shadowEnabled;
            layer.shadowColor = layerData.shadowColor ?? tld.shadowColor;
            layer.shadowBlur = layerData.shadowBlur ?? tld.shadowBlur;
            layer.shadowOffsetX = layerData.shadowOffsetX ?? tld.shadowOffsetX;
            layer.shadowOffsetY = layerData.shadowOffsetY ?? tld.shadowOffsetY;
            layer.visible = layerData.visible !== false;
            return layer;
        } else if (layerData.type === 'image') {
            const ild = CONFIG.imageLayerDefaults;
            const layer = createImageLayer(
                layerData.name, layerData.src, layerData.xPct, layerData.yPct,
                layerData.widthPct ?? ild.widthPct,
                layerData.originalWidth ?? ild.originalWidth,
                layerData.originalHeight ?? ild.originalHeight,
                layerData.blur ?? ild.blur,
                layerData.rotation ?? ild.rotation
            );
            layer.visible = layerData.visible !== false;
            layer.imageScaleY = layerData.imageScaleY ?? 1;
            return layer;
        }
        return null;
    }

    // 将图层对象序列化为纯数据 用于持久化和导出
    function serializeLayer(layer) {
        const s = {
            type: layer.type,
            name: layer.name,
            xPct: layer.xPct,
            yPct: layer.yPct,
            visible: layer.visible,
        };
        if (layer.type === 'text') {
            s.content = layer.content;
            s.fontSize = layer.fontSize;
            s.color = layer.color;
            s.fontFamily = layer.fontFamily;
            s.fontWeight = layer.fontWeight;
            s.textAlign = layer.textAlign;
            s.letterSpacing = layer.letterSpacing;
            s.lineHeight = layer.lineHeight;
            s.shadowEnabled = layer.shadowEnabled;
            s.shadowColor = layer.shadowColor;
            s.shadowBlur = layer.shadowBlur;
            s.shadowOffsetX = layer.shadowOffsetX;
            s.shadowOffsetY = layer.shadowOffsetY;
        } else if (layer.type === 'image') {
            s.src = layer.src;
            s.widthPct = layer.widthPct;
            s.originalWidth = layer.originalWidth;
            s.originalHeight = layer.originalHeight;
            s.blur = layer.blur;
            s.rotation = layer.rotation ?? 0;
            s.imageScaleY = layer.imageScaleY ?? 1;
        }
        return s;
    }

    // 本地存储辅助

    function loadFromStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed !== null && parsed !== undefined) return parsed;
            }
        } catch (e) { /* ignore */ }
        return typeof fallback === 'function' ? fallback() : fallback;
    }

    function saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            showToast('保存失败，可能存储空间不足');
        }
    }

    function loadPresetBgs() { return loadFromStorage('app_preset_bgs', () => JSON.parse(JSON.stringify(CONFIG.presetBgs))); }
    function savePresetBgs(v) { presetBgs = v; saveToStorage('app_preset_bgs', v); }
    function loadCustomTpls() { return loadFromStorage('app_custom_templates', []); }
    function saveCustomTpls(v) { customTemplates = v; saveToStorage('app_custom_templates', v); }
    function loadCustomFonts() { return loadFromStorage('app_custom_fonts', []); }
    function saveCustomFonts(v) { customFonts = v; saveToStorage('app_custom_fonts', v); }

    // 初始化加载预设背景
    presetBgs = loadPresetBgs();
    customTemplates = loadCustomTpls();
    customFonts = loadCustomFonts();

    // 预设背景UI

    function renderPresetBgButtons() {
        presetBgContainer.innerHTML = '';
        presetBgs.forEach((preset, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline';
            btn.style.cssText = getPresetBtnStyle(preset);
            btn.textContent = preset.label;
            btn.title = preset.label;
            btn.onclick = function () {
                applyPresetBgByData(preset);
            };
            presetBgContainer.appendChild(btn);
        });
        if (presetBgs.length === 0) {
            presetBgContainer.innerHTML =
                '<span style="font-size:10px;color:#999;">暂无预设背景</span>';
        }
    }

    function getPresetBtnStyle(preset) {
        if (preset.type === 'solid') {
            const textColor = isLightColor(preset.color) ? '#1a1a2e' : '#fff';
            return 'background:' + preset.color + ';color:' + textColor + ';border-color:' + preset.color + ';';
        } else {
            return 'background:linear-gradient(135deg,' + preset.c1 + ',' + preset.c2 +
                ');color:#fff;border-color:transparent;';
        }
    }

    function isLightColor(hex) {
        const c = hex.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 150;
    }

    function applyPresetBgByData(preset) {
        if (preset.type === 'solid') {
            state.bgType = 'solid';
            state.bgColor = preset.color;
            document.getElementById('bgType').value = 'solid';
            document.getElementById('bgColor').value = preset.color;
            document.getElementById('bgSolidGroup').style.display = 'block';
            document.getElementById('bgGradientGroup').style.display = 'none';
        } else {
            state.bgType = 'gradient';
            state.bgGradColor1 = preset.c1;
            state.bgGradColor2 = preset.c2;
            state.bgGradDirection = preset.dir || 'tl-br';
            document.getElementById('bgType').value = 'gradient';
            document.getElementById('bgGradColor1').value = preset.c1;
            document.getElementById('bgGradColor2').value = preset.c2;
            document.getElementById('bgGradDirection').value = state.bgGradDirection;
            document.getElementById('bgSolidGroup').style.display = 'none';
            document.getElementById('bgGradientGroup').style.display = 'block';
        }
        renderCanvas();
        persistStateIfEnabled();
        showToast('已应用预设背景: ' + preset.label);
    }

    window.editPresetBgList = function () {
        renderPresetBgEditList();
        presetBgModalOverlay.classList.add('active');
    };

    function renderPresetBgEditList() {
        presetBgEditList.innerHTML = '';
        presetBgs.forEach((preset, index) => {
            const li = document.createElement('li');
            li.className = 'preset-edit-item';
            const swatch = document.createElement('span');
            swatch.className = 'preset-swatch';
            if (preset.type === 'solid') {
                swatch.style.background = preset.color;
            } else {
                swatch.style.background = 'linear-gradient(135deg,' + preset.c1 + ',' + preset.c2 + ')';
            }
            const labelSpan = document.createElement('span');
            labelSpan.className = 'preset-label';
            labelSpan.textContent = preset.label;
            const delBtn = document.createElement('button');
            delBtn.className = 'preset-del-btn';
            delBtn.innerHTML = '&times;';
            delBtn.title = '删除';
            delBtn.onclick = function () {
                presetBgs.splice(index, 1);
                savePresetBgs(presetBgs);
                renderPresetBgEditList();
                renderPresetBgButtons();
                renderTemplatePresetDropdown();
            };
            li.appendChild(swatch);
            li.appendChild(labelSpan);
            li.appendChild(delBtn);
            presetBgEditList.appendChild(li);
        });
        if (presetBgs.length === 0) {
            presetBgEditList.innerHTML =
                '<li style="padding:12px;text-align:center;color:#999;font-size:12px;">暂无预设背景</li>';
        }
    }

    window.addPresetBg = function () {
        document.getElementById('addPresetBgType').value = 'solid';
        document.getElementById('addPresetBgSolidGroup').style.display = 'block';
        document.getElementById('addPresetBgGradientGroup').style.display = 'none';
        document.getElementById('addPresetBgSolidColor').value = '#4f6ef7';
        document.getElementById('addPresetBgGradColor1').value = '#4f6ef7';
        document.getElementById('addPresetBgGradColor2').value = '#a855f7';
        document.getElementById('addPresetBgLabel').value = '';
        addPresetBgModalOverlay.classList.add('active');
        setTimeout(() => document.getElementById('addPresetBgLabel').focus(), 150);
    };

    window.onAddPresetBgTypeChange = function () {
        const type = document.getElementById('addPresetBgType').value;
        document.getElementById('addPresetBgSolidGroup').style.display = type === 'solid' ? 'block' : 'none';
        document.getElementById('addPresetBgGradientGroup').style.display = type === 'gradient' ? 'block' : 'none';
    };

    window.saveAddPresetBg = function () {
        const type = document.getElementById('addPresetBgType').value;
        const label = document.getElementById('addPresetBgLabel').value.trim();
        if (!label) {
            showToast('请输入预设名称');
            return;
        }
        if (type === 'solid') {
            const color = document.getElementById('addPresetBgSolidColor').value;
            presetBgs.push({ type: 'solid', color: color, label: label });
        } else {
            const c1 = document.getElementById('addPresetBgGradColor1').value;
            const c2 = document.getElementById('addPresetBgGradColor2').value;
            presetBgs.push({ type: 'gradient', c1: c1, c2: c2, dir: 'tl-br', label: label });
        }
        savePresetBgs(presetBgs);
        renderPresetBgEditList();
        renderPresetBgButtons();
        renderTemplatePresetDropdown();
        closeAddPresetBgModal();
        showToast('已添加背景预设: ' + label);
    };

    window.closeAddPresetBgModal = function () {
        addPresetBgModalOverlay.classList.remove('active');
    };
    addPresetBgModalOverlay.addEventListener('click', function (e) {
        if (e.target === addPresetBgModalOverlay) closeAddPresetBgModal();
    });

    // Font list editing
    window.editFontList = function () {
        renderFontEditList();
        fontListModalOverlay.classList.add('active');
    };

    function renderFontEditList() {
        fontEditList.innerHTML = '';

        // Show built-in fonts first
        CONFIG.fonts.forEach((f, index) => {
            const li = document.createElement('li');
            li.className = 'preset-edit-item';
            const labelSpan = document.createElement('span');
            labelSpan.className = 'preset-label';
            labelSpan.textContent = f.label;
            labelSpan.title = f.value;
            const delBtn = document.createElement('button');
            delBtn.className = 'preset-del-btn';
            delBtn.innerHTML = '&times;';
            delBtn.title = '删除';
            delBtn.onclick = function () {
                CONFIG.fonts.splice(index, 1);
                saveToStorage('app_builtin_fonts', CONFIG.fonts);
                renderFontEditList();
                renderPropsPanel();
            };
            li.appendChild(labelSpan);
            li.appendChild(delBtn);
            fontEditList.appendChild(li);
        });

        // Separator for custom fonts
        if (customFonts.length > 0) {
            const sep = document.createElement('li');
            sep.style.cssText = 'padding:6px 12px;color:var(--text-secondary);font-size:11px;border-top:1px solid var(--border);margin-top:4px;';
            sep.textContent = '自定义字体';
            fontEditList.appendChild(sep);
        }

        customFonts.forEach((cf, index) => {
            const li = document.createElement('li');
            li.className = 'preset-edit-item';
            const labelSpan = document.createElement('span');
            labelSpan.className = 'preset-label';
            labelSpan.textContent = cf.label;
            labelSpan.title = cf.value;
            const delBtn = document.createElement('button');
            delBtn.className = 'preset-del-btn';
            delBtn.innerHTML = '&times;';
            delBtn.title = '删除';
            delBtn.onclick = function () {
                customFonts.splice(index, 1);
                saveCustomFonts(customFonts);
                renderFontEditList();
                renderPropsPanel();
            };
            li.appendChild(labelSpan);
            li.appendChild(delBtn);
            fontEditList.appendChild(li);
        });

        if (CONFIG.fonts.length === 0 && customFonts.length === 0) {
            fontEditList.innerHTML =
                '<li style="padding:12px;text-align:center;color:#999;font-size:12px;">暂无字体</li>';
        }
    }

    window.openAddFontModal = function () {
        document.getElementById('addFontLabel').value = '';
        document.getElementById('addFontValue').value = '';
        addFontModalOverlay.classList.add('active');
        setTimeout(() => document.getElementById('addFontLabel').focus(), 150);
    };

    window.saveAddFont = function () {
        const label = document.getElementById('addFontLabel').value.trim();
        const value = document.getElementById('addFontValue').value.trim();
        if (!label) {
            showToast('请输入字体显示名称');
            return;
        }
        if (!value) {
            showToast('请输入 CSS font-family 值');
            return;
        }
        customFonts.push({ label: label, value: value });
        saveCustomFonts(customFonts);
        renderFontEditList();
        renderPropsPanel();
        closeAddFontModal();
        showToast('已添加字体: ' + label);
    };

    window.closeAddFontModal = function () {
        addFontModalOverlay.classList.remove('active');
    };
    addFontModalOverlay.addEventListener('click', function (e) {
        if (e.target === addFontModalOverlay) closeAddFontModal();
    });

    window.closeFontListModal = function () {
        fontListModalOverlay.classList.remove('active');
    };
    fontListModalOverlay.addEventListener('click', function (e) {
        if (e.target === fontListModalOverlay) closeFontListModal();
    });

    window.closePresetBgModal = function () {
        presetBgModalOverlay.classList.remove('active');
    };
    presetBgModalOverlay.addEventListener('click', function (e) {
        if (e.target === presetBgModalOverlay) closePresetBgModal();
    });

    // 状态对象
    function createInitialState() {
        const d = CONFIG.defaults;
        return {
            ratio: d.ratio,
            quality: d.quality,
            internalWidth: 1920,
            internalHeight: 1080,
            displayScale: 1,
            bgType: d.bgType,
            bgColor: d.bgColor,
            bgGradColor1: d.bgGradColor1,
            bgGradColor2: d.bgGradColor2,
            bgGradDirection: d.bgGradDirection,
            layers: [],
            selectedLayerId: null,
            layerIdCounter: 0,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            dragLayerOrigX: 0,
            dragLayerOrigY: 0,
            isResizing: false,
            resizeHandleIndex: -1,
            resizeStartX: 0,
            resizeStartY: 0,
            resizeOrigLayer: null,
            previewZoom: d.previewZoom,
            darkMode: d.darkMode,
            sidebarCollapsed: d.sidebarCollapsed,
            persistenceEnabled: d.persistenceEnabled,
            allowOutOfBounds: d.allowOutOfBounds,
            alwaysFreeSelect: d.alwaysFreeSelect,
            showBuiltinTemplates: d.showBuiltinTemplates,
            showBuiltinFonts: d.showBuiltinFonts,
            resizeHandlesEnabled: d.resizeHandlesEnabled,
            tempFreeSelect: false,
            activeArchiveSlot: 0,
            watermarkEnabled: d.watermarkEnabled,
            watermarkText: d.watermarkText,
            watermarkColor: d.watermarkColor,
            watermarkOpacity: d.watermarkOpacity,
            watermarkFontSize: d.watermarkFontSize,
            watermarkFontFamily: d.watermarkFontFamily,
            watermarkPosition: d.watermarkPosition,
            watermarkRotation: d.watermarkRotation,
            watermarkGapX: d.watermarkGapX,
            watermarkGapY: d.watermarkGapY,
        };
    }

    const state = createInitialState();

    function persistStateIfEnabled() {
        if (!state.persistenceEnabled) return;
        try {
            savePresetBgs(presetBgs);
            saveCustomTpls(customTemplates);
            // 同时自动保存到当前活跃存档槽
            autoSaveActiveSlot();
            const data = {
                ratio: state.ratio,
                quality: state.quality,
                bgType: state.bgType,
                bgColor: state.bgColor,
                bgGradColor1: state.bgGradColor1,
                bgGradColor2: state.bgGradColor2,
                bgGradDirection: state.bgGradDirection,
                layers: state.layers.map(serializeLayer),
                selectedLayerId: state.selectedLayerId,
                layerIdCounter: state.layerIdCounter,
                previewZoom: state.previewZoom,
                darkMode: state.darkMode,
                sidebarCollapsed: state.sidebarCollapsed,
                allowOutOfBounds: state.allowOutOfBounds,
                alwaysFreeSelect: state.alwaysFreeSelect,
                showBuiltinTemplates: state.showBuiltinTemplates,
                showBuiltinFonts: state.showBuiltinFonts,
                resizeHandlesEnabled: state.resizeHandlesEnabled,
                watermarkEnabled: state.watermarkEnabled,
                watermarkText: state.watermarkText,
                watermarkColor: state.watermarkColor,
                watermarkOpacity: state.watermarkOpacity,
                watermarkFontSize: state.watermarkFontSize,
                watermarkFontFamily: state.watermarkFontFamily,
                watermarkPosition: state.watermarkPosition,
                watermarkRotation: state.watermarkRotation,
                watermarkGapX: state.watermarkGapX,
                watermarkGapY: state.watermarkGapY,
                presetBgs: presetBgs,
                customTemplates: customTemplates,
            };
            localStorage.setItem('app_persistent_state', JSON.stringify(data));
        } catch (e) { }
    }

    function loadPersistedState() {
        try {
            const saved = localStorage.getItem('app_persistent_state');
            if (!saved) return false;
            const data = JSON.parse(saved);
            if (!data || !data.layers) return false;

            const d = CONFIG.defaults;
            state.ratio = data.ratio || d.ratio;
            state.quality = data.quality || d.quality;
            state.bgType = data.bgType || d.bgType;
            state.bgColor = data.bgColor || d.bgColor;
            state.bgGradColor1 = data.bgGradColor1 || d.bgGradColor1;
            state.bgGradColor2 = data.bgGradColor2 || d.bgGradColor2;
            state.bgGradDirection = data.bgGradDirection || d.bgGradDirection;
            state.layerIdCounter = data.layerIdCounter || 0;
            state.previewZoom = data.previewZoom || d.previewZoom;
            state.selectedLayerId = data.selectedLayerId || null;
            state.darkMode = data.darkMode ?? d.darkMode;
            state.sidebarCollapsed = data.sidebarCollapsed || d.sidebarCollapsed;
            state.allowOutOfBounds = data.allowOutOfBounds || d.allowOutOfBounds;
            state.alwaysFreeSelect = data.alwaysFreeSelect || d.alwaysFreeSelect;
            state.showBuiltinTemplates = data.showBuiltinTemplates ?? d.showBuiltinTemplates;
            state.showBuiltinFonts = data.showBuiltinFonts ?? d.showBuiltinFonts;
            state.resizeHandlesEnabled = data.resizeHandlesEnabled ?? d.resizeHandlesEnabled;
            state.watermarkEnabled = data.watermarkEnabled ?? d.watermarkEnabled;
            state.watermarkText = data.watermarkText || d.watermarkText;
            state.watermarkColor = data.watermarkColor || d.watermarkColor;
            state.watermarkOpacity = data.watermarkOpacity ?? d.watermarkOpacity;
            state.watermarkFontSize = data.watermarkFontSize || d.watermarkFontSize;
            state.watermarkFontFamily = data.watermarkFontFamily || d.watermarkFontFamily;
            state.watermarkPosition = data.watermarkPosition || d.watermarkPosition;
            state.watermarkRotation = data.watermarkRotation ?? d.watermarkRotation;
            state.watermarkGapX = data.watermarkGapX || d.watermarkGapX;
            state.watermarkGapY = data.watermarkGapY || d.watermarkGapY;

            if (data.presetBgs && Array.isArray(data.presetBgs)) {
                presetBgs = data.presetBgs;
                savePresetBgs(presetBgs);
            }
            if (data.customTemplates && Array.isArray(data.customTemplates)) {
                customTemplates = data.customTemplates;
                saveCustomTpls(customTemplates);
            }

            // 使用统一解析函数重建所有图层
            state.layers = [];
            data.layers.forEach(layerData => {
                const layer = parseLayerData(layerData);
                if (layer) {
                    layer.id = generateId();
                    state.layers.push(layer);
                    // 异步加载图片
                    if (layer.type === 'image' && layerData.src) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => { layer.imgObj = img; renderCanvas(); };
                        img.src = layerData.src;
                    }
                }
            });

            // 同步UI控件
            document.getElementById('canvasRatio').value = state.ratio;
            document.getElementById('quality').value = state.quality;
            document.getElementById('bgType').value = state.bgType;
            document.getElementById('bgColor').value = state.bgColor;
            document.getElementById('bgGradColor1').value = state.bgGradColor1;
            document.getElementById('bgGradColor2').value = state.bgGradColor2;
            document.getElementById('bgGradDirection').value = state.bgGradDirection;
            document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
            document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';
            updateInternalSize();
            if (state.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
            updateSidebarToggleMenuText();
            return true;
        } catch (e) {
            return false;
        }
    }

    window.togglePersistence = function () {
        state.persistenceEnabled = !state.persistenceEnabled;
        try {
            localStorage.setItem('app_persistence_enabled', state.persistenceEnabled ? '1' : '0');
        } catch (e) { }
        updatePersistenceUI();
        if (state.persistenceEnabled) {
            persistStateIfEnabled();
            showToast('持久化保存已启用，当前状态已保存');
        } else {
            try { localStorage.removeItem('app_persistent_state'); } catch (e) { }
            showToast('持久化保存已关闭');
        }
    };

    window.toggleAllowOutOfBounds = function () {
        state.allowOutOfBounds = !state.allowOutOfBounds;
        updateSettingsMenuChecks();
        persistStateIfEnabled();
        showToast(state.allowOutOfBounds ? '已允许图层内容出界' : '已限制图层内容在画布内');
    };

    window.toggleAlwaysFreeSelect = function () {
        state.alwaysFreeSelect = !state.alwaysFreeSelect;
        updateSettingsMenuChecks();
        persistStateIfEnabled();
        showToast(state.alwaysFreeSelect ? '已启用始终自由选中' : '已关闭始终自由选中');
    };

    window.toggleShowBuiltinTemplates = function () {
        state.showBuiltinTemplates = !state.showBuiltinTemplates;
        updateSettingsMenuChecks();
        renderTemplatePresetDropdown();
        persistStateIfEnabled();
        showToast(state.showBuiltinTemplates ? '已开启展示内置模板' : '已关闭展示内置模板');
    };

    window.toggleShowBuiltinFonts = function () {
        state.showBuiltinFonts = !state.showBuiltinFonts;
        updateSettingsMenuChecks();
        renderPropsPanel();
        persistStateIfEnabled();
        showToast(state.showBuiltinFonts ? '已开启展示预设字体' : '已关闭展示预设字体');
    };

    window.toggleResizeHandles = function () {
        state.resizeHandlesEnabled = !state.resizeHandlesEnabled;
        updateSettingsMenuChecks();
        renderCanvas();
        persistStateIfEnabled();
        showToast(state.resizeHandlesEnabled ? '已开启8点缩放控制' : '已关闭8点缩放控制');
    };

    // 存档功能
    const ARCHIVE_SLOT_COUNT = 5;
    const ARCHIVE_STORAGE_PREFIX = 'app_archive_slot_';

    // 获取当前工程状态快照
    function getCurrentProjectSnapshot() {
        return {
            timestamp: Date.now(),
            ratio: state.ratio,
            quality: state.quality,
            bgType: state.bgType,
            bgColor: state.bgColor,
            bgGradColor1: state.bgGradColor1,
            bgGradColor2: state.bgGradColor2,
            bgGradDirection: state.bgGradDirection,
            layers: state.layers.map(serializeLayer),
            layerIdCounter: state.layerIdCounter,
            watermarkEnabled: state.watermarkEnabled,
            watermarkText: state.watermarkText,
            watermarkColor: state.watermarkColor,
            watermarkOpacity: state.watermarkOpacity,
            watermarkFontSize: state.watermarkFontSize,
            watermarkFontFamily: state.watermarkFontFamily,
            watermarkPosition: state.watermarkPosition,
            watermarkRotation: state.watermarkRotation,
            watermarkGapX: state.watermarkGapX,
            watermarkGapY: state.watermarkGapY,
        };
    }

    // 自动保存当前工程到当前活跃槽位
    function autoSaveActiveSlot() {
        const snapshot = getCurrentProjectSnapshot();
        saveToStorage(ARCHIVE_STORAGE_PREFIX + state.activeArchiveSlot, snapshot);
    }

    // 切换到指定存档槽
    function switchToArchiveSlot(slotIndex) {
        if (slotIndex === state.activeArchiveSlot) {
            closeAllDropdowns();
            return;
        }
        // 先保存当前到旧槽位
        autoSaveActiveSlot();
        // 切换到新槽位
        state.activeArchiveSlot = slotIndex;
        saveToStorage('app_archive_active_slot', slotIndex);
        // 尝试加载新槽位数据
        const data = loadFromStorage(ARCHIVE_STORAGE_PREFIX + slotIndex, null);
        if (data) {
            loadArchiveData(data, slotIndex);
        } else {
            // 空槽位重置为空白工程
            resetToBlankProject();
            showToast('已切换到 存档 ' + (slotIndex + 1));
        }
        renderArchiveSlotList();
        closeAllDropdowns();
    }

    // 加载存档数据到当前工程
    function loadArchiveData(data, slotIndex) {
        state.ratio = data.ratio || CONFIG.defaults.ratio;
        state.quality = data.quality || CONFIG.defaults.quality;
        state.bgType = data.bgType || CONFIG.defaults.bgType;
        state.bgColor = data.bgColor || CONFIG.defaults.bgColor;
        state.bgGradColor1 = data.bgGradColor1 || CONFIG.defaults.bgGradColor1;
        state.bgGradColor2 = data.bgGradColor2 || CONFIG.defaults.bgGradColor2;
        state.bgGradDirection = data.bgGradDirection || CONFIG.defaults.bgGradDirection;
        state.layerIdCounter = data.layerIdCounter || 0;
        state.watermarkEnabled = data.watermarkEnabled ?? CONFIG.defaults.watermarkEnabled;
        state.watermarkText = data.watermarkText || CONFIG.defaults.watermarkText;
        state.watermarkColor = data.watermarkColor || CONFIG.defaults.watermarkColor;
        state.watermarkOpacity = data.watermarkOpacity ?? CONFIG.defaults.watermarkOpacity;
        state.watermarkFontSize = data.watermarkFontSize || CONFIG.defaults.watermarkFontSize;
        state.watermarkFontFamily = data.watermarkFontFamily || CONFIG.defaults.watermarkFontFamily;
        state.watermarkPosition = data.watermarkPosition || CONFIG.defaults.watermarkPosition;
        state.watermarkRotation = data.watermarkRotation ?? CONFIG.defaults.watermarkRotation;
        state.watermarkGapX = data.watermarkGapX || CONFIG.defaults.watermarkGapX;
        state.watermarkGapY = data.watermarkGapY || CONFIG.defaults.watermarkGapY;

        document.getElementById('canvasRatio').value = state.ratio;
        document.getElementById('quality').value = state.quality;
        document.getElementById('bgType').value = state.bgType;
        document.getElementById('bgColor').value = state.bgColor;
        document.getElementById('bgGradColor1').value = state.bgGradColor1;
        document.getElementById('bgGradColor2').value = state.bgGradColor2;
        document.getElementById('bgGradDirection').value = state.bgGradDirection;
        document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
        document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';
        updateInternalSize();

        state.layers = [];
        if (data.layers) {
            data.layers.forEach(layerData => {
                const layer = parseLayerData(layerData);
                if (layer) {
                    state.layers.push(layer);
                    if (layer.type === 'image' && layerData.src) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => { layer.imgObj = img; renderCanvas(); };
                        img.src = layerData.src;
                    }
                }
            });
        }
        state.selectedLayerId = state.layers.length > 0 ? state.layers[0].id : null;
        state.previewZoom = 1;

        renderLayerList();
        renderPropsPanel();
        syncWatermarkUI();
        updatePreviewDisplay();
        renderCanvas();
        persistStateIfEnabled();
        showToast('已切换到 存档 ' + (slotIndex + 1));
    }

    // 重置为空白工程
    function resetToBlankProject() {
        const d = CONFIG.defaults;
        state.ratio = d.ratio;
        state.quality = d.quality;
        state.bgType = d.bgType;
        state.bgColor = d.bgColor;
        state.bgGradColor1 = d.bgGradColor1;
        state.bgGradColor2 = d.bgGradColor2;
        state.bgGradDirection = d.bgGradDirection;
        state.layers = [];
        state.layerIdCounter = 0;
        state.selectedLayerId = null;
        state.previewZoom = 1;
        state.watermarkEnabled = d.watermarkEnabled;
        state.watermarkText = d.watermarkText;
        state.watermarkColor = d.watermarkColor;
        state.watermarkOpacity = d.watermarkOpacity;
        state.watermarkFontSize = d.watermarkFontSize;
        state.watermarkFontFamily = d.watermarkFontFamily;
        state.watermarkPosition = d.watermarkPosition;
        state.watermarkRotation = d.watermarkRotation;
        state.watermarkGapX = d.watermarkGapX;
        state.watermarkGapY = d.watermarkGapY;

        document.getElementById('canvasRatio').value = state.ratio;
        document.getElementById('quality').value = state.quality;
        document.getElementById('bgType').value = state.bgType;
        document.getElementById('bgColor').value = state.bgColor;
        document.getElementById('bgGradColor1').value = state.bgGradColor1;
        document.getElementById('bgGradColor2').value = state.bgGradColor2;
        document.getElementById('bgGradDirection').value = state.bgGradDirection;
        document.getElementById('bgSolidGroup').style.display = 'block';
        document.getElementById('bgGradientGroup').style.display = 'none';
        updateInternalSize();

        renderLayerList();
        renderPropsPanel();
        updatePreviewDisplay();
        renderCanvas();
        persistStateIfEnabled();
    }

    // 删除指定存档槽
    function deleteArchiveSlot(slotIndex) {
        try {
            localStorage.removeItem(ARCHIVE_STORAGE_PREFIX + slotIndex);
        } catch (e) { }
        // 当前活跃槽删除 重置为空白
        if (slotIndex === state.activeArchiveSlot) {
            resetToBlankProject();
        }
        renderArchiveSlotList();
        showToast('已删除 存档 ' + (slotIndex + 1));
    }

    // 渲染存档下拉列表
    function renderArchiveSlotList() {
        const container = document.getElementById('archiveSlotList');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 0; i < ARCHIVE_SLOT_COUNT; i++) {
            const data = loadFromStorage(ARCHIVE_STORAGE_PREFIX + i, null);
            const hasData = data && data.layers && data.layers.length > 0;
            const isActive = i === state.activeArchiveSlot;

            const item = document.createElement('div');
            item.className = 'archive-slot-item' +
                (hasData ? ' has-data' : '') +
                (isActive ? ' active' : '');

            // 名称
            const nameEl = document.createElement('span');
            nameEl.className = 'archive-slot-name';
            nameEl.textContent = '存档 ' + (i + 1);

            // 选中圆点
            const dotEl = document.createElement('span');
            dotEl.className = 'archive-slot-dot';

            // 删除按钮
            const delBtn = document.createElement('button');
            delBtn.className = 'archive-slot-del';
            delBtn.innerHTML = '&#x2715;';
            delBtn.title = '删除 存档 ' + (i + 1);
            delBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                showConfirmDialog({
                    title: '删除存档',
                    message: '确定要删除 存档 ' + (i + 1) + ' 吗？\n此操作不可撤销',
                    confirmText: '删除',
                    onConfirm: function () {
                        deleteArchiveSlot(i);
                    }
                });
            });

            // 点击切换
            item.addEventListener('click', function (e) {
                if (e.target.closest('.archive-slot-del')) return;
                switchToArchiveSlot(i);
            });

            item.appendChild(nameEl);
            item.appendChild(dotEl);
            item.appendChild(delBtn);
            container.appendChild(item);
        }
    }

    window.switchToArchiveSlot = switchToArchiveSlot;
    window.deleteArchiveSlot = deleteArchiveSlot;
    window.renderArchiveSlotList = renderArchiveSlotList;

    function updatePersistenceUI() {
        const check = document.getElementById('settingsPersistenceCheck');
        if (check) check.style.display = state.persistenceEnabled ? 'inline' : 'none';
    }

    function loadPersistenceSetting() {
        try {
            const val = localStorage.getItem('app_persistence_enabled');
            if (val === null) {
                state.persistenceEnabled = true;
                localStorage.setItem('app_persistence_enabled', '1');
            } else {
                state.persistenceEnabled = (val === '1');
            }
        } catch (e) {
            state.persistenceEnabled = true;
        }
        updatePersistenceUI();
    }

    function renderTemplatePresetDropdown() {
        templatePresetList.innerHTML = '';
        const builtinLabel = document.getElementById('templateBuiltinLabel');
        const builtinSeparator = document.getElementById('templateBuiltinSeparator');

        if (state.showBuiltinTemplates) {
            if (builtinLabel) builtinLabel.style.display = '';
            if (builtinSeparator) builtinSeparator.style.display = '';
            const builtinEntries = Object.entries(templates || {});
            builtinEntries.forEach(([key, tpl]) => {
                const btn = document.createElement('button');
                btn.className = 'topbar-dropdown-item';
                btn.textContent = tpl.name || key;
                btn.onclick = function () {
                    applyTemplate(key);
                    closeAllDropdowns();
                };
                templatePresetList.appendChild(btn);
            });
        } else {
            if (builtinLabel) builtinLabel.style.display = 'none';
            if (builtinSeparator) builtinSeparator.style.display = '';
        }
        if (customTemplates.length > 0) {
            if (state.showBuiltinTemplates) {
                const sep = document.createElement('div');
                sep.className = 'topbar-dropdown-separator';
                templatePresetList.appendChild(sep);
            }
            const subLabel = document.createElement('span');
            subLabel.className = 'topbar-dropdown-sub-label';
            subLabel.textContent = '自定义模板';
            templatePresetList.appendChild(subLabel);
            customTemplates.forEach((ctpl, idx) => {
                const btn = document.createElement('button');
                btn.className = 'topbar-dropdown-item';
                btn.textContent = ctpl.name;
                btn.onclick = function () {
                    applyCustomTemplateData(ctpl);
                    closeAllDropdowns();
                };
                // 删除按钮
                const delBtn = document.createElement('span');
                delBtn.className = 'template-del-btn';
                delBtn.innerHTML = '&#x2715;';
                delBtn.title = '删除模板';
                delBtn.onclick = function (e) {
                    e.stopPropagation();
                    customTemplates.splice(idx, 1);
                    saveCustomTpls(customTemplates);
                    renderTemplatePresetDropdown();
                    showToast('已删除模板: ' + ctpl.name);
                };
                btn.appendChild(delBtn);
                templatePresetList.appendChild(btn);
            });
        }
    }

    function applyCustomTemplateData(ctpl) {
        if (!ctpl || !ctpl.data) return;
        const tpl = ctpl.data;
        applyTemplateData(tpl);
        showToast('已应用自定义模板: ' + ctpl.name);
    }

    // 统一的模板数据应用
    function applyTemplateData(tpl) {
        state.bgType = tpl.bgType || CONFIG.defaults.bgType;
        state.bgColor = tpl.bgColor || CONFIG.defaults.bgColor;
        if (tpl.bgType === 'gradient') {
            state.bgGradColor1 = tpl.bgGradColor1 || CONFIG.defaults.bgGradColor1;
            state.bgGradColor2 = tpl.bgGradColor2 || CONFIG.defaults.bgGradColor2;
            state.bgGradDirection = tpl.bgGradDirection || CONFIG.defaults.bgGradDirection;
        }
        document.getElementById('bgType').value = state.bgType;
        document.getElementById('bgColor').value = state.bgColor;
        document.getElementById('bgGradColor1').value = state.bgGradColor1;
        document.getElementById('bgGradColor2').value = state.bgGradColor2;
        document.getElementById('bgGradDirection').value = state.bgGradDirection;
        document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
        document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';

        state.layers = [];
        state.layerIdCounter = 0;
        if (tpl.layers) {
            tpl.layers.forEach(layerData => {
                const layer = parseLayerData(layerData);
                if (layer) {
                    state.layers.push(layer);
                    // 异步加载图片
                    if (layer.type === 'image' && layerData.src) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => { layer.imgObj = img; renderCanvas(); };
                        img.src = layerData.src;
                    }
                }
            });
        }
        state.selectedLayerId = state.layers.length > 0 ? state.layers[0].id : null;
        renderLayerList();
        renderPropsPanel();
        renderCanvas();
        persistStateIfEnabled();
        showToast('已应用模板: ' + (tpl.name || '自定义'));
    }

    window.addCustomTemplate = function () {
        customTemplateNameInput.value = '';
        customTemplateModalOverlay.classList.add('active');
        setTimeout(() => customTemplateNameInput.focus(), 150);
    };

    window.saveCustomTemplate = function () {
        const name = customTemplateNameInput.value.trim();
        if (!name) {
            showToast('请输入模板名称');
            return;
        }
        const tplData = {
            bgType: state.bgType,
            bgColor: state.bgColor,
            bgGradColor1: state.bgGradColor1,
            bgGradColor2: state.bgGradColor2,
            bgGradDirection: state.bgGradDirection,
            layers: state.layers.map(serializeLayer),
        };
        customTemplates.push({ name: name, data: tplData, createdAt: Date.now() });
        saveCustomTpls(customTemplates);
        renderTemplatePresetDropdown();
        closeCustomTemplateModal();
        showToast('自定义模板已保存: ' + name);
    };

    window.closeCustomTemplateModal = function () {
        customTemplateModalOverlay.classList.remove('active');
    };
    customTemplateModalOverlay.addEventListener('click', function (e) {
        if (e.target === customTemplateModalOverlay) closeCustomTemplateModal();
    });

    window.exportConfigFile = function () {
        // 收集所有存档槽数据
        const archiveSlots = [];
        for (let i = 0; i < 5; i++) {
            const slotData = loadFromStorage('app_archive_slot_' + i, null);
            archiveSlots.push(slotData);
        }
        const configData = {
            version: '1.0',
            type: 'config',
            timestamp: Date.now(),
            presetBgs: presetBgs,
            customTemplates: customTemplates,
            darkMode: state.darkMode,
            persistenceEnabled: state.persistenceEnabled,
            allowOutOfBounds: state.allowOutOfBounds,
            alwaysFreeSelect: state.alwaysFreeSelect,
            showBuiltinTemplates: state.showBuiltinTemplates,
            showBuiltinFonts: state.showBuiltinFonts,
            resizeHandlesEnabled: state.resizeHandlesEnabled,
            activeArchiveSlot: state.activeArchiveSlot,
            archiveSlots: archiveSlots,
        };
        const jsonStr = JSON.stringify(configData);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'ProdPicStudio_config_' + new Date().toISOString().slice(0, 19) + '.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showToast('配置文件已导出');
    };

    window.importConfigFile = function () {
        configFileInput.click();
    };

    window.handleConfigImport = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.type !== 'config') {
                    showToast('导入失败: 不是有效的配置文件');
                    return;
                }
                let changes = [];
                if (data.presetBgs && Array.isArray(data.presetBgs)) {
                    presetBgs = data.presetBgs;
                    savePresetBgs(presetBgs);
                    changes.push('预设背景');
                }
                if (data.customTemplates && Array.isArray(data.customTemplates)) {
                    data.customTemplates.forEach(ct => {
                        if (!customTemplates.some(t => t.name === ct.name && t.createdAt === ct.createdAt)) {
                            customTemplates.push(ct);
                        }
                    });
                    saveCustomTpls(customTemplates);
                    changes.push('自定义模板');
                }
                if (data.darkMode !== undefined) {
                    state.darkMode = data.darkMode;
                    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
                    changes.push('深色模式');
                }
                if (data.persistenceEnabled !== undefined) {
                    state.persistenceEnabled = data.persistenceEnabled;
                    localStorage.setItem('app_persistence_enabled', state.persistenceEnabled ? '1' : '0');
                    changes.push('持久化保存');
                }
                if (data.allowOutOfBounds !== undefined) {
                    state.allowOutOfBounds = data.allowOutOfBounds;
                    changes.push('允许图层内容出界');
                }
                if (data.alwaysFreeSelect !== undefined) {
                    state.alwaysFreeSelect = data.alwaysFreeSelect;
                    changes.push('始终启用自由选中');
                }
                if (data.showBuiltinTemplates !== undefined) {
                    state.showBuiltinTemplates = data.showBuiltinTemplates;
                    changes.push('展示内置模板');
                }
                if (data.showBuiltinFonts !== undefined) {
                    state.showBuiltinFonts = data.showBuiltinFonts;
                    changes.push('展示预设字体');
                }
                if (data.resizeHandlesEnabled !== undefined) {
                    state.resizeHandlesEnabled = data.resizeHandlesEnabled;
                    changes.push('8点缩放控制');
                }
                if (data.archiveSlots && Array.isArray(data.archiveSlots)) {
                    data.archiveSlots.forEach((slotData, i) => {
                        if (slotData && slotData.layers) {
                            saveToStorage('app_archive_slot_' + i, slotData);
                        }
                    });
                    changes.push('临时存档工程');
                }
                if (data.activeArchiveSlot !== undefined) {
                    state.activeArchiveSlot = data.activeArchiveSlot;
                    saveToStorage('app_archive_active_slot', data.activeArchiveSlot);
                }
                renderPresetBgButtons();
                renderTemplatePresetDropdown();
                updateSettingsMenuChecks();
                updatePersistenceUI();
                updatePreviewCheckerboard();
                persistStateIfEnabled();
                if (changes.length > 0) {
                    showToast('已导入设置: ' + changes.join('、'));
                } else {
                    showToast('配置文件中没有可导入的设置项');
                }
            } catch (err) {
                showToast('导入配置文件失败: 文件格式错误');
                console.error('Config import error:', err);
            }
        };
        reader.readAsText(file);
        configFileInput.value = '';
    };

    let activeDropdownId = null;

    window.toggleDropdown = function (menuId) {
        const dropdownId = 'dropdown' + menuId.replace('menu', '');
        const dropdown = document.getElementById(dropdownId);
        const btn = document.querySelector('#' + menuId + ' .topbar-menu-btn');
        if (!dropdown) return;

        if (activeDropdownId === menuId) {
            closeAllDropdowns();
            return;
        }
        closeAllDropdowns();
        dropdown.classList.add('show');
        if (btn) btn.classList.add('active');
        activeDropdownId = menuId;
        if (menuId === 'menuTemplate') {
            renderTemplatePresetDropdown();
        }
        if (menuId === 'menuArchive') {
            renderArchiveSlotList();
        }
        if (menuId === 'menuSettings') {
            updateSettingsMenuChecks();
            updateSidebarToggleMenuText();
        }
    };

    function updateSettingsMenuChecks() {
        const darkCheck = document.getElementById('settingsDarkModeCheck');
        const persistCheck = document.getElementById('settingsPersistenceCheck');
        const outOfBoundsCheck = document.getElementById('settingsOutOfBoundsCheck');
        const freeSelectCheck = document.getElementById('settingsFreeSelectCheck');
        const showBuiltinTemplatesCheck = document.getElementById('settingsShowBuiltinTemplatesCheck');
        if (darkCheck) darkCheck.style.display = state.darkMode ? 'inline' : 'none';
        if (persistCheck) persistCheck.style.display = state.persistenceEnabled ? 'inline' : 'none';
        if (outOfBoundsCheck) outOfBoundsCheck.style.display = state.allowOutOfBounds ? 'inline' : 'none';
        if (freeSelectCheck) freeSelectCheck.style.display = state.alwaysFreeSelect ? 'inline' : 'none';
        if (showBuiltinTemplatesCheck) showBuiltinTemplatesCheck.style.display = state.showBuiltinTemplates ? 'inline' : 'none';
        const showBuiltinFontsCheck = document.getElementById('settingsShowBuiltinFontsCheck');
        if (showBuiltinFontsCheck) showBuiltinFontsCheck.style.display = state.showBuiltinFonts ? 'inline' : 'none';
        const resizeHandlesCheck = document.getElementById('settingsResizeHandlesCheck');
        if (resizeHandlesCheck) resizeHandlesCheck.style.display = state.resizeHandlesEnabled ? 'inline' : 'none';
    }

    function updateSidebarToggleMenuText() {
        const btn = document.getElementById('settingsSidebarToggleBtn');
        if (btn) {
            btn.textContent = state.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏';
        }
    }

    window.closeAllDropdowns = function () {
        if (activeDropdownId) {
            const dropdownId = 'dropdown' + activeDropdownId.replace('menu', '');
            const dropdown = document.getElementById(dropdownId);
            const btn = document.querySelector('#' + activeDropdownId + ' .topbar-menu-btn');
            if (dropdown) dropdown.classList.remove('show');
            if (btn) btn.classList.remove('active');
            activeDropdownId = null;
        }
    };

    window.toggleDarkModeFromMenu = function () {
        toggleDarkMode();
        updateSettingsMenuChecks();
    };

    document.addEventListener('click', function (e) {
        if (activeDropdownId && !e.target.closest('.topbar-menu')) {
            closeAllDropdowns();
        }
    });

    window.showTutorialModal = function () {
        tutorialModalOverlay.classList.add('active');
    };
    window.closeTutorialModal = function () {
        tutorialModalOverlay.classList.remove('active');
    };
    tutorialModalOverlay.addEventListener('click', function (e) {
        if (e.target === tutorialModalOverlay) closeTutorialModal();
    });

    window.showAboutModal = function () {
        aboutModalOverlay.classList.add('active');
    };
    window.closeAboutModal = function () {
        aboutModalOverlay.classList.remove('active');
    };
    aboutModalOverlay.addEventListener('click', function (e) {
        if (e.target === aboutModalOverlay) closeAboutModal();
    });

    window.showFaqModal = function () {
        faqModalOverlay.classList.add('active');
    };
    window.closeFaqModal = function () {
        faqModalOverlay.classList.remove('active');
    };
    faqModalOverlay.addEventListener('click', function (e) {
        if (e.target === faqModalOverlay) closeFaqModal();
    });

    function shouldShowWelcome() {
        try {
            const dontShowUntil = localStorage.getItem('app_welcome_dont_show_until');
            if (dontShowUntil) {
                const until = parseInt(dontShowUntil, 10);
                if (Date.now() < until) return false;
            }
        } catch (e) { }
        return true;
    }

    window.closeWelcomeModal = function () {
        const dontShowAgain = document.getElementById('welcomeDontShowAgain');
        if (dontShowAgain && dontShowAgain.checked) {
            try {
                const until = Date.now() + 7 * 24 * 60 * 60 * 1000;
                localStorage.setItem('app_welcome_dont_show_until', until.toString());
            } catch (e) { }
        }
        welcomeModalOverlay.classList.remove('active');
    };
    welcomeModalOverlay.addEventListener('click', function (e) {
        if (e.target === welcomeModalOverlay) closeWelcomeModal();
    });

    function generateId() {
        state.layerIdCounter++;
        return 'layer_' + state.layerIdCounter + '_' + Date.now();
    }

    function getRatioValues(ratioStr) {
        return CONFIG.ratioMap[ratioStr] || [16, 9];
    }

    function getQualityMultiplier(quality) {
        return CONFIG.qualityMap[quality] || 1080;
    }

    function calcInternalSize(ratioStr, quality) {
        const [rw, rh] = getRatioValues(ratioStr);
        const base = getQualityMultiplier(quality);
        let w, h;
        if (rw >= rh) {
            h = Math.round(base);
            w = Math.round(base * (rw / rh));
        } else {
            w = Math.round(base);
            h = Math.round(base * (rh / rw));
        }
        return { w, h };
    }

    function updateInternalSize() {
        const { w, h } = calcInternalSize(state.ratio, state.quality);
        state.internalWidth = w;
        state.internalHeight = h;
        document.getElementById('actualResolution').textContent = w + 'x' + h;
    }

    function getDisplayScale() {
        const maxDisplayW = previewArea.clientWidth - 60;
        const maxDisplayH = previewArea.clientHeight - 140;
        const zw = state.previewZoom;
        const scaleW = (maxDisplayW * zw) / state.internalWidth;
        const scaleH = (maxDisplayH * zw) / state.internalHeight;
        return Math.min(scaleW, scaleH, 2.5);
    }

    function createTextLayer(name, content, xPct, yPct, fontSize, color, fontFamily, fontWeight) {
        const tld = CONFIG.textLayerDefaults;
        return {
            id: generateId(),
            type: 'text',
            name: name || '文字图层',
            content: content || '请输入文字',
            xPct: xPct !== undefined ? xPct : 50,
            yPct: yPct !== undefined ? yPct : 40,
            fontSize: fontSize || tld.fontSize,
            color: color || tld.color,
            fontFamily: fontFamily || tld.fontFamily,
            fontWeight: fontWeight || tld.fontWeight,
            textAlign: tld.textAlign,
            letterSpacing: tld.letterSpacing,
            lineHeight: tld.lineHeight,
            shadowEnabled: tld.shadowEnabled,
            shadowColor: tld.shadowColor,
            shadowBlur: tld.shadowBlur,
            shadowOffsetX: tld.shadowOffsetX,
            shadowOffsetY: tld.shadowOffsetY,
            visible: true,
        };
    }

    function createImageLayer(name, src, xPct, yPct, widthPct, origW, origH, blur, rotation) {
        const ild = CONFIG.imageLayerDefaults;
        return {
            id: generateId(),
            type: 'image',
            name: name || '图片',
            src: src,
            xPct: xPct !== undefined ? xPct : 50,
            yPct: yPct !== undefined ? yPct : 50,
            widthPct: widthPct !== undefined ? widthPct : ild.widthPct,
            originalWidth: origW || ild.originalWidth,
            originalHeight: origH || ild.originalHeight,
            blur: blur !== undefined ? blur : ild.blur,
            rotation: rotation !== undefined ? rotation : ild.rotation,
            visible: true,
            imgObj: null,
            imageScaleY: 1,
        };
    }

    function getLayerById(id) {
        return state.layers.find(l => l.id === id);
    }

    function getSelectedLayer() {
        return state.selectedLayerId ? getLayerById(state.selectedLayerId) : null;
    }

    function selectLayer(id) {
        state.selectedLayerId = id;
        renderLayerList();
        renderPropsPanel();
        renderCanvas();
        persistStateIfEnabled();
        showToast('已选中: ' + (getLayerById(id)?.name || '图层'));
    }

    function deleteLayer(id) {
        const idx = state.layers.findIndex(l => l.id === id);
        if (idx >= 0) {
            const name = state.layers[idx].name;
            state.layers.splice(idx, 1);
            if (state.selectedLayerId === id) {
                state.selectedLayerId = state.layers.length > 0 ? state.layers[Math.min(idx, state.layers.length -
                    1)].id : null;
            }
            renderLayerList();
            renderPropsPanel();
            renderCanvas();
            persistStateIfEnabled();
            showToast('已删除: ' + name);
        }
    }

    function moveLayerUp(id) {
        const idx = state.layers.findIndex(l => l.id === id);
        if (idx > 0) {
            [state.layers[idx - 1], state.layers[idx]] = [state.layers[idx], state.layers[idx - 1]];
            renderLayerList();
            renderCanvas();
            persistStateIfEnabled();
        }
    }

    function moveLayerDown(id) {
        const idx = state.layers.findIndex(l => l.id === id);
        if (idx < state.layers.length - 1) {
            [state.layers[idx], state.layers[idx + 1]] = [state.layers[idx + 1], state.layers[idx]];
            renderLayerList();
            renderCanvas();
            persistStateIfEnabled();
        }
    }

    function toggleLayerVisibility(id) {
        const layer = getLayerById(id);
        if (layer) {
            layer.visible = !layer.visible;
            renderLayerList();
            renderCanvas();
            persistStateIfEnabled();
        }
    }

    function duplicateLayer(id) {
        const layer = getLayerById(id);
        if (!layer) return;
        const clone = JSON.parse(JSON.stringify(layer));
        clone.id = generateId();
        clone.name = layer.name + ' (副本)';
        clone.xPct = Math.min(95, clone.xPct + 3);
        clone.yPct = Math.min(95, clone.yPct + 3);
        if (clone.type === 'image') {
            clone.imgObj = layer.imgObj;
        }
        const idx = state.layers.findIndex(l => l.id === id);
        state.layers.splice(idx + 1, 0, clone);
        state.selectedLayerId = clone.id;
        renderLayerList();
        renderPropsPanel();
        renderCanvas();
        persistStateIfEnabled();
        showToast('已复制图层');
    }

    function renderLayerList() {
        layerListEl.innerHTML = '';
        state.layers.forEach((layer, index) => {
            const li = document.createElement('li');
            li.className = 'layer-item' + (layer.id === state.selectedLayerId ? ' active' : '');
            li.setAttribute('data-layer-id', layer.id);
            li.onclick = (e) => {
                if (!e.target.closest('button') && !e.target.closest('.layer-visibility')) {
                    selectLayer(layer.id);
                }
            };
            const iconText = layer.type === 'text' ? 'T' : 'IMG';
            const detail = layer.type === 'text' ?
                (layer.content || '(空)').substring(0, 18) :
                (layer.widthPct || '?') + '% 宽';
            li.innerHTML = `
                <span class="layer-visibility ${layer.visible ? '' : 'hidden'}"
                        title="${layer.visible ? '可见' : '已隐藏'}"
                        onclick="event.stopPropagation(); window._toggleLayerVisibility('${layer.id}')">${layer.visible ? '&#x25CF;' : '&#x25CB;'}
                </span>
                <span class="layer-icon">${iconText}</span>
                <span class="layer-info">
                    <span class="layer-name">${escapeHtml(layer.name)}</span>
                    <span class="layer-detail">${escapeHtml(detail)}</span>
                </span>
                <span class="layer-actions">
                    <button title="上移" onclick="event.stopPropagation(); window._moveLayerUp('${layer.id}')">&#x25B2;</button>
                    <button title="下移" onclick="event.stopPropagation(); window._moveLayerDown('${layer.id}')">&#x25BC;</button>
                    <button title="复制" onclick="event.stopPropagation(); window._duplicateLayer('${layer.id}')">+</button>
                    <button class="del" title="删除" onclick="event.stopPropagation(); window._deleteLayer('${layer.id}')">&#x2715;</button>
                </span>
            `;
            layerListEl.appendChild(li);
        });
        if (state.layers.length === 0) {
            layerListEl.innerHTML =
                '<li style="padding:16px;text-align:center;color:#bbb;font-size:12px;">暂无图层，点击下方按钮添加</li>';
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    window._toggleLayerVisibility = toggleLayerVisibility;
    window._moveLayerUp = moveLayerUp;
    window._moveLayerDown = moveLayerDown;
    window._duplicateLayer = duplicateLayer;
    window._deleteLayer = deleteLayer;

    function renderPropsPanel() {
        const layer = getSelectedLayer();
        if (!layer) {
            propsBody.innerHTML =
                '<p class="empty-state empty-state--small">请选择一个图层进行编辑</p>';
            return;
        }
        let html = '';
        html += '<div><label>图层名称</label><input type="text" value="' + escapeHtml(layer.name) +
            '" onchange="window._updateLayerProp(\'name\', this.value)" placeholder="图层名称"></div>';
        if (layer.type === 'text') {
            html += '<div><label>文字内容</label><input type="text" value="' + escapeHtml(layer.content) +
                '" onchange="window._updateLayerProp(\'content\', this.value)" placeholder="输入文字内容"></div>';
            html += '<div class="row"><div><label>字号(px)</label><div class="font-size-control">' +
                '<input type="number" value="' + layer.fontSize + '" onchange="window._updateLayerProp(\'fontSize\', parseInt(this.value)||64, this)" oninput="window._updateLayerProp(\'fontSize\', parseInt(this.value)||64, this)" min="8" max="800">' +
                '<input type="range" value="' + layer.fontSize + '" oninput="window._updateLayerProp(\'fontSize\', parseInt(this.value)||64, this)" min="8" max="800" step="1">' +
                '</div></div>';
            html += '<div><label>字间距</label><div class="font-size-control">' +
                '<input type="number" value="' + (layer.letterSpacing || 0) + '" onchange="window._updateLayerProp(\'letterSpacing\', parseFloat(this.value)||0, this)" oninput="window._updateLayerProp(\'letterSpacing\', parseFloat(this.value)||0, this)" step="0.5">' +
                '<input type="range" value="' + (layer.letterSpacing || 0) + '" oninput="window._updateLayerProp(\'letterSpacing\', parseFloat(this.value)||0, this)" min="-20" max="40" step="0.5">' +
                '</div></div></div>';
            html += '<div class="row"><div><label>文字颜色</label><input type="color" value="' + layer.color +
                '" onchange="window._updateLayerProp(\'color\', this.value)"></div>';
            html += '<div class="center-btn-cell"><button type="button" class="btn btn-sm btn-outline" onclick="window._centerLayerHorizontal()" title="水平居中">水平居中</button>' +
                '<button type="button" class="btn btn-sm btn-outline" onclick="window._centerLayerVertical()" title="垂直居中">垂直居中</button></div></div>';
            html += '<div class="row"><div><label>字体</label><select onchange="window._updateLayerProp(\'fontFamily\', this.value)">' +
                buildFontOptions(layer.fontFamily) + '</select></div>';
            html += '<div><label>字重</label><select onchange="window._updateLayerProp(\'fontWeight\', this.value)">' +
                buildFontWeightOptions(layer.fontWeight) + '</select></div></div>';
            html +=
                '<div class="property-check-row"><label><input type="checkbox" ' + (layer.shadowEnabled ? 'checked' : '') +
                ' onchange="window._updateLayerProp(\'shadowEnabled\', this.checked)"> 文字阴影</label></div>';
            if (layer.shadowEnabled) {
                html += '<div class="row"><div><label>阴影颜色</label><input type="color" value="' + (layer.shadowColor ||
                    '#000000') +
                    '" onchange="window._updateLayerProp(\'shadowColor\', this.value)"></div>';
                html += '<div><label>模糊度</label><input type="number" value="' + (layer.shadowBlur || 8) +
                    '" onchange="window._updateLayerProp(\'shadowBlur\', parseInt(this.value)||0)" min="0" max="100"></div></div>';
                html += '<div class="row"><div><label>偏移X</label><input type="number" value="' + (layer.shadowOffsetX ||
                    2) +
                    '" onchange="window._updateLayerProp(\'shadowOffsetX\', parseInt(this.value)||0)"></div>';
                html += '<div><label>偏移Y</label><input type="number" value="' + (layer.shadowOffsetY || 2) +
                    '" onchange="window._updateLayerProp(\'shadowOffsetY\', parseInt(this.value)||0)"></div></div>';
            }
            html += '<div><label>行高倍数</label><input type="number" value="' + (layer.lineHeight || 1.3) +
                '" onchange="window._updateLayerProp(\'lineHeight\', parseFloat(this.value)||1.3)" step="0.1" min="0.8" max="3"></div>';
        } else if (layer.type === 'image') {
            html += '<div><label>图片宽度(%)</label><div class="font-size-control">' +
                '<input type="number" value="' + layer.widthPct.toFixed(1) + '" onchange="window._updateLayerProp(\'widthPct\', parseFloat(this.value)||30, this)" oninput="window._updateLayerProp(\'widthPct\', parseFloat(this.value)||30, this)" min="3" max="90" step="0.5">' +
                '<input type="range" value="' + layer.widthPct + '" oninput="window._updateLayerProp(\'widthPct\', parseFloat(this.value)||30, this)" min="3" max="90" step="0.5">' +
                '</div></div>';
            html += '<div><label>模糊(px)</label><div class="font-size-control">' +
                '<input type="number" value="' + (layer.blur || 0) + '" onchange="window._updateLayerProp(\'blur\', parseInt(this.value)||0, this)" oninput="window._updateLayerProp(\'blur\', parseInt(this.value)||0, this)" min="0" max="50" step="1">' +
                '<input type="range" value="' + (layer.blur || 0) + '" oninput="window._updateLayerProp(\'blur\', parseInt(this.value)||0, this)" min="0" max="50" step="1">' +
                '</div></div>';
            html += '<div><label>旋转角度(°)</label><div class="font-size-control">' +
                '<input type="number" value="' + (layer.rotation || 0) + '" onchange="window._updateLayerProp(\'rotation\', parseInt(this.value)||0, this)" oninput="window._updateLayerProp(\'rotation\', parseInt(this.value)||0, this)" min="-180" max="180" step="1">' +
                '<input type="range" value="' + (layer.rotation || 0) + '" oninput="window._updateLayerProp(\'rotation\', parseInt(this.value)||0, this)" min="-180" max="180" step="1">' +
                '</div></div>';
            html += '<div class="row"><div><button type="button" class="btn btn-sm btn-outline" onclick="window._centerLayerHorizontal()" title="水平居中">水平居中</button>' +
                '<button type="button" class="btn btn-sm btn-outline" onclick="window._centerLayerVertical()" title="垂直居中">垂直居中</button></div>';
            html += '<div><label>更换图片</label><button class="btn btn-sm btn-outline" onclick="document.getElementById(\'imageFileInput\').setAttribute(\'data-layer-id\',\'' +
                layer.id + '\');document.getElementById(\'imageFileInput\').click();">选择图片</button></div></div>';
            html += '<div style="margin-top:4px;"><button class="btn btn-sm btn-accent" onclick="window._saveImageAsNewLayer(\'' + layer.id + '\')" title="将当前图片按参数渲染后存为新图片图层">渲染为新图层</button></div>';
        }
        html += '<div class="row"><div><label>X位置(%)</label><input type="number" value="' + layer.xPct.toFixed(
            1) +
            '" onchange="window._updateLayerProp(\'xPct\', parseFloat(this.value)||50)" min="-100" max="200" step="0.5"></div>';
        html += '<div><label>Y位置(%)</label><input type="number" value="' + layer.yPct.toFixed(1) +
            '" onchange="window._updateLayerProp(\'yPct\', parseFloat(this.value)||50)" min="-100" max="200" step="0.5"></div></div>';
        propsBody.innerHTML = html;
        // 同步更新水印字体下拉列表
        buildWatermarkFontSelect();
    }

    function buildFontOptions(currentFont) {
        let opts = '';
        if (state.showBuiltinFonts) {
            CONFIG.fonts.forEach(f => {
                // if (f.value === 'system-ui, sans-serif') return;
                const sel = f.value === currentFont ? ' selected' : '';
                opts += '<option value="' + escapeHtml(f.value) + '"' + sel + '>' + escapeHtml(f.label) + '</option>';
            });
        }
        const sysSel = 'system-ui, sans-serif' === currentFont ? ' selected' : '';
        opts += '<option value="system-ui, sans-serif"' + sysSel + '>系统默认</option>';
        if (customFonts.length > 0) {
            opts += '<option disabled>──── 自定义 ────</option>';
            customFonts.forEach(cf => {
                const sel = cf.value === currentFont ? ' selected' : '';
                opts += '<option value="' + escapeHtml(cf.value) + '"' + sel + '>' + escapeHtml(cf.label) + '</option>';
            });
        }
        return opts;
    }

    function buildFontWeightOptions(currentWeight) {
        let opts = '';
        (CONFIG.fontWeights || []).forEach(fw => {
            const sel = fw.value === currentWeight ? ' selected' : '';
            opts += '<option value="' + escapeHtml(fw.value) + '"' + sel + '>' + escapeHtml(fw.label) + '</option>';
        });
        return opts;
    }

    window._updateLayerProp = function (prop, value, sourceEl) {
        const layer = getSelectedLayer();
        if (!layer) return;
        layer[prop] = value;
        if (['fontSize', 'letterSpacing', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY', 'lineHeight',
            'widthPct', 'blur', 'rotation'
        ].includes(prop)) {
            layer[prop] = Number(value) || 0;
        }
        if (['xPct', 'yPct'].includes(prop)) {
            if (state.allowOutOfBounds) {
                layer[prop] = Number(value) || 50;
            } else {
                layer[prop] = Math.max(0, Math.min(100, Number(value) || 50));
            }
        }
        // 文字相关属性变更时失效排版缓存
        if (['content', 'fontSize', 'fontFamily', 'fontWeight', 'letterSpacing', 'lineHeight'].includes(prop)) {
            invalidateTextLayoutCache(layer);
        }
        // 同步兄弟输入框
        if (['fontSize', 'letterSpacing', 'widthPct', 'blur', 'rotation'].includes(prop) && sourceEl) {
            const container = sourceEl.closest('.font-size-control');
            if (container) {
                const otherInput = container.querySelector(sourceEl.tagName === 'INPUT' && sourceEl.type === 'range' ? 'input[type="number"]' : 'input[type="range"]');
                if (otherInput) {
                    if (otherInput.type === 'range') {
                        otherInput.value = layer[prop];
                    } else {
                        otherInput.value = prop === 'widthPct' ? Number(layer[prop]).toFixed(1) : layer[prop];
                    }
                }
            }
        }
        const shouldRefreshPanel = !['fontSize', 'letterSpacing', 'widthPct', 'blur', 'rotation', 'textAlign'].includes(prop);
        if (shouldRefreshPanel) {
            renderPropsPanel();
        }
        renderCanvas();
        persistStateIfEnabled();
    };

    window._centerLayerHorizontal = function () {
        const layer = getSelectedLayer();
        if (!layer) return;
        layer.xPct = 50;
        renderCanvas();
        renderPropsPanel();
        persistStateIfEnabled();
        showToast('图层已水平居中');
    };

    window._centerLayerVertical = function () {
        const layer = getSelectedLayer();
        if (!layer) return;
        layer.yPct = 50;
        renderCanvas();
        renderPropsPanel();
        persistStateIfEnabled();
        showToast('图层已垂直居中');
    };

    window._saveImageAsNewLayer = function (layerId) {
        const layer = getLayerById(layerId);
        if (!layer || layer.type !== 'image') return;
        if (!layer.imgObj) {
            showToast('图片未加载完成，无法存为新图层');
            return;
        }

        // 计算当前图层在画布上的实际绘制尺寸
        const w = state.internalWidth;
        const h = state.internalHeight;
        const imgW = (layer.widthPct / 100) * w;
        const aspectRatio = layer.originalHeight / layer.originalWidth;
        const scaleY = layer.imageScaleY || 1;
        const imgH = imgW * aspectRatio * scaleY;
        const rotation = layer.rotation || 0;

        // 计算旋转后的边界尺寸
        let rotatedW = imgW;
        let rotatedH = imgH;
        if (rotation !== 0) {
            const rad = Math.abs(rotation * Math.PI / 180);
            const cos = Math.abs(Math.cos(rad));
            const sin = Math.abs(Math.sin(rad));
            rotatedW = Math.ceil(imgW * cos + imgH * sin);
            rotatedH = Math.ceil(imgW * sin + imgH * cos);
        }

        // 创建离屏canvas渲染当前图层
        const offCanvas = document.createElement('canvas');
        const blurPad = (layer.blur || 0) * 2;
        offCanvas.width = Math.ceil(rotatedW + blurPad);
        offCanvas.height = Math.ceil(rotatedH + blurPad);
        const offCtx = offCanvas.getContext('2d');

        offCtx.save();
        offCtx.translate(offCanvas.width / 2, offCanvas.height / 2);
        if (rotation !== 0) {
            offCtx.rotate(rotation * Math.PI / 180);
        }
        if (layer.blur && layer.blur > 0) {
            offCtx.filter = 'blur(' + layer.blur + 'px)';
        }
        offCtx.drawImage(layer.imgObj, -imgW / 2, -imgH / 2, imgW, imgH);
        offCtx.restore();

        const dataUrl = offCanvas.toDataURL('image/png');

        // 创建新的对象
        const newImg = new Image();
        newImg.onload = function () {
            // 计算新图层在画布上的宽度百分比
            const newWidthPct = (offCanvas.width / w) * 100;

            const newLayer = createImageLayer(
                layer.name + ' (已渲染)',
                dataUrl,
                layer.xPct,
                layer.yPct,
                newWidthPct,
                offCanvas.width,
                offCanvas.height,
                0,    // blur已烘焙
                0     // rotation已烘焙
            );
            newLayer.imgObj = newImg;

            // 找到原图层索引
            const idx = state.layers.findIndex(l => l.id === layer.id);
            // 在同一位置插入新图层
            state.layers.splice(idx + 1, 0, newLayer);

            state.selectedLayerId = newLayer.id;
            renderLayerList();
            renderPropsPanel();
            renderCanvas();
            persistStateIfEnabled();
            showToast('已渲染为新图层: ' + newLayer.name);
        };
        newImg.onerror = function () {
            showToast('渲染为新图层失败');
        };
        newImg.src = dataUrl;
    };

    function getTopLayerAtPoint(canvasX, canvasY) {
        for (let i = state.layers.length - 1; i >= 0; i--) {
            const layer = state.layers[i];
            if (!layer.visible) continue;
            if (isPointInLayer(canvasX, canvasY, layer)) {
                return layer;
            }
        }
        return null;
    }

    function renderCanvas() {
        const w = state.internalWidth;
        const h = state.internalHeight;
        mainCanvas.width = w;
        mainCanvas.height = h;
        ctx.clearRect(0, 0, w, h);
        if (state.bgType === 'solid') {
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(0, 0, w, h);
        } else if (state.bgType === 'gradient') {
            let gradient;
            const c1 = state.bgGradColor1;
            const c2 = state.bgGradColor2;
            const dir = state.bgGradDirection;
            if (dir === 'radial') {
                gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.5);
            } else {
                const [x1, y1, x2, y2] = getGradientCoords(dir, w, h);
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            }
            gradient.addColorStop(0, c1);
            gradient.addColorStop(1, c2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }
        state.layers.forEach(layer => {
            if (!layer.visible) return;
            const px = (layer.xPct / 100) * w;
            const py = (layer.yPct / 100) * h;
            if (layer.type === 'text') {
                drawTextLayer(layer, px, py, w, h);
            } else if (layer.type === 'image') {
                drawImageLayer(layer, px, py, w, h);
            }
        });
        const selLayer = getSelectedLayer();
        if (selLayer && selLayer.visible) {
            drawSelectionIndicator(selLayer, w, h);
        }
        // 绘制水印
        drawWatermark(ctx, w, h);
        updatePreviewDisplay();
    }

    function getGradientCoords(dir, w, h) {
        switch (dir) {
            case 'top-bottom':
                return [w / 2, 0, w / 2, h];
            case 'bottom-top':
                return [w / 2, h, w / 2, 0];
            case 'left-right':
                return [0, h / 2, w, h / 2];
            case 'right-left':
                return [w, h / 2, 0, h / 2];
            case 'tl-br':
                return [0, 0, w, h];
            case 'tr-bl':
                return [w, 0, 0, h];
            default:
                return [w / 2, 0, w / 2, h];
        }
    }

    function drawTextLayer(layer, px, py, w, h) {
        const layout = getTextLayout(layer, w);
        ctx.save();
        ctx.font = (layer.fontWeight || 'bold') + ' ' + layer.fontSize + 'px ' + (layer.fontFamily || 'sans-serif');
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.textAlign || 'center';
        ctx.textBaseline = 'top';
        if (layer.letterSpacing && layer.letterSpacing !== 0) {
            ctx.letterSpacing = layer.letterSpacing + 'px';
        }
        if (layer.shadowEnabled) {
            ctx.shadowColor = layer.shadowColor || '#000';
            ctx.shadowBlur = layer.shadowBlur || 8;
            ctx.shadowOffsetX = layer.shadowOffsetX || 2;
            ctx.shadowOffsetY = layer.shadowOffsetY || 2;
        }
        let drawX = px;
        if (layer.textAlign === 'left') drawX = Math.max(layer.fontSize * 0.2, px);
        else if (layer.textAlign === 'right') drawX = Math.min(w - layer.fontSize * 0.2, px);
        layout.lines.forEach((line, i) => {
            ctx.fillText(line, drawX, py + i * layout.lineHeight);
        });
        ctx.restore();
    }

    function drawImageLayer(layer, px, py, w, h) {
        if (!layer.imgObj && layer.src) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                layer.imgObj = img;
                layer.originalWidth = img.naturalWidth;
                layer.originalHeight = img.naturalHeight;
                renderCanvas();
            };
            img.onerror = () => {
                layer.imgObj = null;
                renderCanvas();
            };
            img.src = layer.src;
            drawImagePlaceholder(px, py, w, h, layer);
            return;
        }
        if (!layer.imgObj) {
            drawImagePlaceholder(px, py, w, h, layer);
            return;
        }
        const imgW = (layer.widthPct / 100) * w;
        const aspectRatio = layer.originalHeight / layer.originalWidth;
        const scaleY = layer.imageScaleY || 1;
        const imgH = imgW * aspectRatio * scaleY;
        const rotation = layer.rotation || 0;

        ctx.save();
        // 移动到图片中心旋转再绘制
        ctx.translate(px, py);
        if (rotation !== 0) {
            ctx.rotate(rotation * Math.PI / 180);
        }
        if (layer.blur && layer.blur > 0) {
            ctx.filter = 'blur(' + layer.blur + 'px)';
        }
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(layer.imgObj, -imgW / 2, -imgH / 2, imgW, imgH);
        ctx.restore();
    }

    function drawImagePlaceholder(px, py, w, h, layer) {
        const imgW = (layer.widthPct / 100) * w;
        const aspectRatio = (layer.originalHeight || 600) / (layer.originalWidth || 800);
        const scaleY = layer.imageScaleY || 1;
        const imgH = imgW * aspectRatio * scaleY;
        const rotation = layer.rotation || 0;

        ctx.save();
        ctx.translate(px, py);
        if (rotation !== 0) {
            ctx.rotate(rotation * Math.PI / 180);
        }
        ctx.fillStyle = 'rgba(200,200,210,0.5)';
        ctx.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
        ctx.strokeStyle = 'rgba(150,150,160,0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-imgW / 2, -imgH / 2, imgW, imgH);
        ctx.setLineDash([]);
        ctx.fillStyle = '#888';
        ctx.font = Math.min(imgH * 0.3, 28) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[图片加载中...]', 0, 0);
        ctx.restore();
    }

    // 获取图层包围盒 返回 {boxX, boxY, boxW, boxH}
    function getLayerContentBox(layer, w, h) {
        const px = (layer.xPct / 100) * w;
        const py = (layer.yPct / 100) * h;
        if (layer.type === 'text') {
            const layout = getTextLayout(layer, w);
            let boxW = layout.maxLineW;
            let boxH = layout.totalH;
            let boxX;
            if (layer.textAlign === 'center') boxX = px - boxW / 2;
            else if (layer.textAlign === 'left') boxX = px - 6;
            else boxX = px - boxW + 6;
            return { boxX, boxY: py - 4, boxW, boxH };
        } else if (layer.type === 'image') {
            const imgW = (layer.widthPct / 100) * w;
            const aspectRatio = (layer.originalHeight || 600) / (layer.originalWidth || 800);
            const scaleY = layer.imageScaleY || 1;
            const imgH = imgW * aspectRatio * scaleY;
            const rotation = layer.rotation || 0;
            if (rotation !== 0) {
                // 计算旋转后的轴对齐包围盒
                const rad = rotation * Math.PI / 180;
                const cos = Math.abs(Math.cos(rad));
                const sin = Math.abs(Math.sin(rad));
                const rotatedW = imgW * cos + imgH * sin;
                const rotatedH = imgW * sin + imgH * cos;
                return { boxX: px - rotatedW / 2, boxY: py - rotatedH / 2, boxW: rotatedW, boxH: rotatedH };
            }
            return { boxX: px - imgW / 2, boxY: py - imgH / 2, boxW: imgW, boxH: imgH };
        }
        return null;
    }

    function drawSelectionIndicator(layer, w, h) {
        const box = getLayerContentBox(layer, w, h);
        if (!box) return;
        // 选中框带padding
        const pad = 4;
        const selX = box.boxX - pad;
        const selY = box.boxY - pad;
        const selW = box.boxW + pad * 2;
        const selH = box.boxH + pad * 2;

        ctx.save();
        ctx.strokeStyle = '#4f6ef7';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 3]);
        ctx.shadowColor = 'rgba(79,110,247,0.5)';
        ctx.shadowBlur = 8;
        ctx.strokeRect(selX, selY, selW, selH);
        ctx.setLineDash([]);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        const handleSize = state.resizeHandlesEnabled ? 7 : 8;
        // 控制点
        const handles = [
            [selX, selY],                   // 0: 左上
            [selX + selW, selY],             // 1: 右上
            [selX, selY + selH],             // 2: 左下
            [selX + selW, selY + selH],      // 3: 右下
            [selX + selW / 2, selY],         // 4: 上中
            [selX + selW, selY + selH / 2],  // 5: 右中
            [selX + selW / 2, selY + selH],  // 6: 下中
            [selX, selY + selH / 2],         // 7: 左中
        ];

        handles.forEach(([hx, hy], idx) => {
            if (idx >= 4 && !state.resizeHandlesEnabled) return;
            ctx.fillStyle = '#4f6ef7';
            ctx.beginPath();
            ctx.arc(hx, hy, handleSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(hx, hy, handleSize - 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    function updatePreviewDisplay() {
        state.displayScale = getDisplayScale();
        const displayW = Math.round(state.internalWidth * state.displayScale);
        const displayH = Math.round(state.internalHeight * state.displayScale);
        mainCanvas.style.width = displayW + 'px';
        mainCanvas.style.height = displayH + 'px';
    }

    function scheduleRender() {
        clearTimeout(window._renderTimeout);
        window._renderTimeout = setTimeout(() => {
            renderCanvas();
            renderPropsPanel();
            persistStateIfEnabled();
        }, 80);
    }

    // 文本排版缓存 requestAnimationFrame节流
    let _dragRafId = null;
    const _textLayoutCache = new WeakMap();

    function invalidateTextLayoutCache(layer) {
        _textLayoutCache.delete(layer);
    }

    // 缓存文字排版结果
    function getTextLayout(layer, w) {
        const fontKey = layer.fontWeight + '|' + layer.fontSize + '|' + layer.fontFamily + '|' + (layer.letterSpacing || 0);
        const maxW = w * 0.9;
        let cached = _textLayoutCache.get(layer);
        if (cached && cached.fontKey === fontKey && cached.content === layer.content && cached.maxWidth === maxW) {
            return cached;
        }
        ctx.save();
        ctx.font = (layer.fontWeight || 'bold') + ' ' + layer.fontSize + 'px ' + (layer.fontFamily || 'sans-serif');
        if (layer.letterSpacing && layer.letterSpacing !== 0) {
            ctx.letterSpacing = layer.letterSpacing + 'px';
        }
        const lh = (layer.lineHeight || 1.3) * layer.fontSize;
        const lines = (layer.content || '').split('\n');
        const allLines = [];
        let maxLineW = 0;
        lines.forEach(line => {
            const chars = line.split('');
            let cur = '';
            for (let i = 0; i < chars.length; i++) {
                const test = cur + chars[i];
                if (ctx.measureText(test).width > maxW && cur.length > 0) {
                    allLines.push(cur);
                    maxLineW = Math.max(maxLineW, ctx.measureText(cur).width);
                    cur = chars[i];
                } else { cur = test; }
            }
            if (cur) { allLines.push(cur); maxLineW = Math.max(maxLineW, ctx.measureText(cur).width); }
        });
        ctx.restore();
        cached = { fontKey, content: layer.content, maxWidth: maxW, lines: allLines, lineHeight: lh, maxLineW: Math.max(maxLineW + 16, 60), totalH: allLines.length * lh + 10 };
        _textLayoutCache.set(layer, cached);
        return cached;
    }

    // 拖拽中轻量渲染 RAF节流 + 跳过propsPanel重建
    function renderCanvasDrag() {
        if (_dragRafId) return;
        _dragRafId = requestAnimationFrame(() => {
            _dragRafId = null;
            renderCanvas();
            updatePositionInputs();
        });
    }

    // 更新位置数值 不重建整个属性面板
    function updatePositionInputs() {
        const allNumInputs = propsBody.querySelectorAll('input[type="number"]');
        if (allNumInputs.length >= 2) {
            const layer = getSelectedLayer();
            if (layer) {
                allNumInputs[allNumInputs.length - 2].value = layer.xPct.toFixed(1);
                allNumInputs[allNumInputs.length - 1].value = layer.yPct.toFixed(1);
            }
        }
    }

    // 检测鼠标选中手柄 返回手柄索引0-7 未命中返回-1
    function getHandleIndexAtPoint(mouseCanvasX, mouseCanvasY, layer, w, h) {
        if (!layer || !layer.visible) return -1;
        const box = getLayerContentBox(layer, w, h);
        if (!box) return -1;
        const pad = 4;
        const selX = box.boxX - pad;
        const selY = box.boxY - pad;
        const selW = box.boxW + pad * 2;
        const selH = box.boxH + pad * 2;
        const handles = [
            { x: selX, y: selY },                   // 0: 左上
            { x: selX + selW, y: selY },             // 1: 右上
            { x: selX, y: selY + selH },             // 2: 左下
            { x: selX + selW, y: selY + selH },      // 3: 右下
            { x: selX + selW / 2, y: selY },         // 4: 上中
            { x: selX + selW, y: selY + selH / 2 },  // 5: 右中
            { x: selX + selW / 2, y: selY + selH },  // 6: 下中
            { x: selX, y: selY + selH / 2 },         // 7: 左中
        ];
        const hitRadius = 14;
        for (let i = 0; i < handles.length; i++) {
            if (i >= 4 && !state.resizeHandlesEnabled) continue;
            const dx = mouseCanvasX - handles[i].x;
            const dy = mouseCanvasY - handles[i].y;
            if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) return i;
        }
        return -1;
    }

    // CSS光标样式
    function getResizeCursor(handleIdx) {
        const cursors = ['nwse-resize', 'nesw-resize', 'nesw-resize', 'nwse-resize',
            'ns-resize', 'ew-resize', 'ns-resize', 'ew-resize'];
        return cursors[handleIdx] || 'default';
    }

    // 克隆图层关键属性用于缩放计算
    function cloneLayerForResize(layer) {
        const c = {
            type: layer.type,
            xPct: layer.xPct,
            yPct: layer.yPct,
        };
        if (layer.type === 'image') {
            c.widthPct = layer.widthPct;
            c.imageScaleY = layer.imageScaleY || 1;
            c.originalWidth = layer.originalWidth;
            c.originalHeight = layer.originalHeight;
        } else if (layer.type === 'text') {
            c.fontSize = layer.fontSize;
            c.textAlign = layer.textAlign;
        }
        return c;
    }

    // 从克隆快照恢复图层到缩放前状态
    function applyResizeSnapshot(layer, snap) {
        layer.xPct = snap.xPct;
        layer.yPct = snap.yPct;
        if (layer.type === 'image') {
            layer.widthPct = snap.widthPct;
            layer.imageScaleY = snap.imageScaleY;
        } else if (layer.type === 'text') {
            layer.fontSize = snap.fontSize;
        }
    }

    // 计算缩放后的图层属性
    function computeResize(layer, snap, handleIdx, mouseCanvasX, mouseCanvasY, canvasW, canvasH) {
        // 获取快照状态下的包围盒
        const tempLayer = { type: snap.type, xPct: snap.xPct, yPct: snap.yPct };
        if (snap.type === 'image') {
            tempLayer.widthPct = snap.widthPct;
            tempLayer.imageScaleY = snap.imageScaleY;
            tempLayer.originalWidth = snap.originalWidth;
            tempLayer.originalHeight = snap.originalHeight;
            tempLayer.rotation = layer.rotation || 0;
        } else {
            tempLayer.fontSize = snap.fontSize;
            tempLayer.textAlign = snap.textAlign;
            tempLayer.content = layer.content;
            tempLayer.fontFamily = layer.fontFamily;
            tempLayer.fontWeight = layer.fontWeight;
            tempLayer.letterSpacing = layer.letterSpacing;
            tempLayer.lineHeight = layer.lineHeight;
        }
        const box = getLayerContentBox(tempLayer, canvasW, canvasH);
        if (!box) return;

        const isCorner = handleIdx < 4;
        // 固定的对角 对边
        let fixedCX, fixedCY; // 内容包围盒的固定角坐标
        switch (handleIdx) {
            case 0: fixedCX = box.boxX + box.boxW; fixedCY = box.boxY + box.boxH; break; // 左上拖
            case 1: fixedCX = box.boxX; fixedCY = box.boxY + box.boxH; break;             // 右上拖
            case 2: fixedCX = box.boxX + box.boxW; fixedCY = box.boxY; break;             // 左下拖
            case 3: fixedCX = box.boxX; fixedCY = box.boxY; break;                        // 右下拖
            case 4: fixedCY = box.boxY + box.boxH; break;  // 上中拖
            case 5: fixedCX = box.boxX; break;              // 右中拖
            case 6: fixedCY = box.boxY; break;              // 下中拖
            case 7: fixedCX = box.boxX + box.boxW; break;   // 左中拖
        }

        if (isCorner) {
            // 等比缩放
            const aspectRatio = box.boxW > 0 ? box.boxH / box.boxW : 1;
            const dx = mouseCanvasX - fixedCX;
            const dy = mouseCanvasY - fixedCY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            let newW, newH;
            if (aspectRatio > 0 && absDx * aspectRatio > absDy) {
                // Y方向受限
                newH = absDy;
                newW = newH / aspectRatio;
            } else if (aspectRatio > 0) {
                // X方向受限
                newW = absDx;
                newH = newW * aspectRatio;
            } else {
                newW = absDx;
                newH = absDy;
            }
            // 限制最小尺寸
            newW = Math.max(10, newW);
            newH = Math.max(10, newH);

            const signX = dx >= 0 ? 1 : -1;
            const signY = dy >= 0 ? 1 : -1;
            const newCX = fixedCX + signX * newW / 2;
            const newCY = fixedCY + signY * newH / 2;

            const newXPct = (newCX / canvasW) * 100;
            const newYPct = (newCY / canvasH) * 100;

            if (layer.type === 'image') {
                const scale = newW / (box.boxW || 1);
                layer.widthPct = snap.widthPct * scale;
                // 等比缩放时保持imageScaleY不变
                layer.imageScaleY = snap.imageScaleY;
                layer.xPct = newXPct;
                layer.yPct = newYPct;
            } else {
                // 文本缩放fontSize
                const scale = newH / (box.boxH || 1);
                layer.fontSize = Math.max(6, Math.round(snap.fontSize * scale));
                layer.xPct = newXPct;
                layer.yPct = newYPct;
            }
        } else {
            // 边中点拖拽
            if (handleIdx === 4 || handleIdx === 6) {
                // 上下边中点
                const newH = Math.max(10, Math.abs(mouseCanvasY - fixedCY));
                const signY = handleIdx === 6 ? 1 : -1;
                const newCY = fixedCY + signY * newH / 2;
                const newYPct = (newCY / canvasH) * 100;
                layer.yPct = newYPct;

                if (layer.type === 'image') {
                    const scale = newH / (box.boxH || 1);
                    layer.imageScaleY = snap.imageScaleY * scale;
                    layer.widthPct = snap.widthPct;
                    layer.xPct = snap.xPct;
                } else {
                    const scale = newH / (box.boxH || 1);
                    layer.fontSize = Math.max(6, Math.round(snap.fontSize * scale));
                    layer.xPct = snap.xPct;
                }
            } else {
                // 左右边中点
                const newW = Math.max(10, Math.abs(mouseCanvasX - fixedCX));
                const signX = handleIdx === 5 ? 1 : -1;
                const newCX = fixedCX + signX * newW / 2;
                const newXPct = (newCX / canvasW) * 100;
                layer.xPct = newXPct;

                if (layer.type === 'image') {
                    const scale = newW / (box.boxW || 1);
                    layer.widthPct = snap.widthPct * scale;
                    // 反向补偿imageScaleY
                    layer.imageScaleY = snap.imageScaleY / scale;
                    layer.yPct = snap.yPct;
                } else {
                    const scale = newW / (box.boxW || 1);
                    layer.fontSize = Math.max(6, Math.round(snap.fontSize * scale));
                    layer.yPct = snap.yPct;
                }
            }
        }
    }

    previewWrapper.addEventListener('mousedown', function (e) {
        if (e.target !== mainCanvas && e.target !== previewWrapper) return;

        const rect = mainCanvas.getBoundingClientRect();
        const scaleX = state.internalWidth / rect.width;
        const scaleY = state.internalHeight / rect.height;
        const mouseCanvasX = (e.clientX - rect.left) * scaleX;
        const mouseCanvasY = (e.clientY - rect.top) * scaleY;

        if (e.button === 1) {
            const clickedLayer = getTopLayerAtPoint(mouseCanvasX, mouseCanvasY);
            if (clickedLayer) {
                selectLayer(clickedLayer.id);
            }
            e.preventDefault();
            return false;
        }

        // 检查是否点击了选中图层的手柄
        if (e.button === 0 && state.resizeHandlesEnabled) {
            const selLayer = getSelectedLayer();
            if (selLayer && selLayer.visible) {
                const w = state.internalWidth;
                const h = state.internalHeight;
                const handleIdx = getHandleIndexAtPoint(mouseCanvasX, mouseCanvasY, selLayer, w, h);
                if (handleIdx >= 0) {
                    state.isResizing = true;
                    state.resizeHandleIndex = handleIdx;
                    state.resizeStartX = e.clientX;
                    state.resizeStartY = e.clientY;
                    state.resizeOrigLayer = cloneLayerForResize(selLayer);
                    previewWrapper.style.cursor = getResizeCursor(handleIdx);
                    previewWrapper.classList.add('dragging');
                    e.preventDefault();
                    return;
                }
            }
        }

        if ((state.alwaysFreeSelect || state.tempFreeSelect) && e.button === 0) {
            const clickedLayer = getTopLayerAtPoint(mouseCanvasX, mouseCanvasY);

            if (clickedLayer) {
                const prevSelectedId = state.selectedLayerId;
                if (clickedLayer.id !== prevSelectedId) {
                    selectLayer(clickedLayer.id);
                }
                if (state.tempFreeSelect && clickedLayer.id !== prevSelectedId) {
                    state.tempFreeSelect = false;
                    showToast('自由选中已关闭');
                }
                state.isDragging = true;
                state.dragStartX = e.clientX;
                state.dragStartY = e.clientY;
                state.dragLayerOrigX = clickedLayer.xPct;
                state.dragLayerOrigY = clickedLayer.yPct;
                previewWrapper.classList.add('dragging');
                e.preventDefault();
                return;
            }
        }

        const selLayer2 = getSelectedLayer();
        if (!selLayer2 || !selLayer2.visible) return;
        if (isPointInLayer(mouseCanvasX, mouseCanvasY, selLayer2)) {
            state.isDragging = true;
            state.dragStartX = e.clientX;
            state.dragStartY = e.clientY;
            state.dragLayerOrigX = selLayer2.xPct;
            state.dragLayerOrigY = selLayer2.yPct;
            previewWrapper.classList.add('dragging');
            e.preventDefault();
        }
    });

    window.addEventListener('mousemove', function (e) {
        if (state.isResizing) {
            const selLayer = getSelectedLayer();
            if (!selLayer || !state.resizeOrigLayer) return;
            const rect = mainCanvas.getBoundingClientRect();
            const scaleX = state.internalWidth / rect.width;
            const scaleY = state.internalHeight / rect.height;
            const mouseCanvasX = (e.clientX - rect.left) * scaleX;
            const mouseCanvasY = (e.clientY - rect.top) * scaleY;
            applyResizeSnapshot(selLayer, state.resizeOrigLayer);
            computeResize(selLayer, state.resizeOrigLayer, state.resizeHandleIndex,
                mouseCanvasX, mouseCanvasY, state.internalWidth, state.internalHeight);
            renderCanvasDrag();
            return;
        }
        if (!state.isDragging) return;
        const selLayer = getSelectedLayer();
        if (!selLayer) return;
        const rect = mainCanvas.getBoundingClientRect();
        const dx = (e.clientX - state.dragStartX) / rect.width * 100;
        const dy = (e.clientY - state.dragStartY) / rect.height * 100;
        const newX = state.dragLayerOrigX + dx;
        const newY = state.dragLayerOrigY + dy;
        selLayer.xPct = state.allowOutOfBounds ? newX : Math.max(0, Math.min(100, newX));
        selLayer.yPct = state.allowOutOfBounds ? newY : Math.max(0, Math.min(100, newY));
        renderCanvasDrag();
    });

    window.addEventListener('mouseup', function () {
        if (state.isResizing) {
            state.isResizing = false;
            state.resizeHandleIndex = -1;
            state.resizeOrigLayer = null;
            previewWrapper.classList.remove('dragging');
            previewWrapper.style.cursor = '';
            renderCanvas();
            renderPropsPanel();
            persistStateIfEnabled();
        }
        if (state.isDragging) {
            state.isDragging = false;
            previewWrapper.classList.remove('dragging');
            renderCanvas();
            persistStateIfEnabled();
        }
    });

    previewArea.addEventListener('wheel', function (e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.005;
            state.previewZoom = Math.max(0.3, Math.min(2.5, state.previewZoom + delta));
            updatePreviewDisplay();
        }
    }, { passive: false });

    function isPointInLayer(canvasX, canvasY, layer) {
        const w = state.internalWidth;
        const h = state.internalHeight;
        const px = (layer.xPct / 100) * w;
        const py = (layer.yPct / 100) * h;
        let boxW, boxH, boxX, boxY;
        if (layer.type === 'text') {
            const layout = getTextLayout(layer, w);
            boxW = layout.maxLineW;
            boxH = layout.totalH;
            if (layer.textAlign === 'center') boxX = px - boxW / 2;
            else if (layer.textAlign === 'left') boxX = px - 6;
            else boxX = px - boxW + 6;
            boxY = py - 4;
        } else if (layer.type === 'image') {
            const imgW = (layer.widthPct / 100) * w;
            const aspectRatio = (layer.originalHeight || 600) / (layer.originalWidth || 800);
            const scaleY = layer.imageScaleY || 1;
            const imgH = imgW * aspectRatio * scaleY;
            const rotation = layer.rotation || 0;
            let rW = imgW, rH = imgH;
            if (rotation !== 0) {
                const rad = rotation * Math.PI / 180;
                const cos = Math.abs(Math.cos(rad));
                const sin = Math.abs(Math.sin(rad));
                rW = imgW * cos + imgH * sin;
                rH = imgW * sin + imgH * cos;
            }
            boxW = rW + 8;
            boxH = rH + 8;
            boxX = px - rW / 2 - 4;
            boxY = py - rH / 2 - 4;
        } else {
            return false;
        }
        const margin = 15;
        return canvasX >= boxX - margin && canvasX <= boxX + boxW + margin &&
            canvasY >= boxY - margin && canvasY <= boxY + boxH + margin;
    }

    previewWrapper.addEventListener('mousemove', function (e) {
        if (state.isDragging || state.isResizing) return;
        const selLayer = getSelectedLayer();
        if (!selLayer || !selLayer.visible) {
            previewWrapper.style.cursor = 'default';
            return;
        }
        const rect = mainCanvas.getBoundingClientRect();
        const scaleX = state.internalWidth / rect.width;
        const scaleY = state.internalHeight / rect.height;
        const mouseCanvasX = (e.clientX - rect.left) * scaleX;
        const mouseCanvasY = (e.clientY - rect.top) * scaleY;
        // 优先检查手柄
        if (state.resizeHandlesEnabled) {
            const w = state.internalWidth;
            const h = state.internalHeight;
            const handleIdx = getHandleIndexAtPoint(mouseCanvasX, mouseCanvasY, selLayer, w, h);
            if (handleIdx >= 0) {
                previewWrapper.style.cursor = getResizeCursor(handleIdx);
                return;
            }
        }
        if (isPointInLayer(mouseCanvasX, mouseCanvasY, selLayer)) {
            previewWrapper.style.cursor = 'move';
        } else {
            previewWrapper.style.cursor = 'default';
        }
    });

    window.addEventListener('resize', () => {
        updatePreviewDisplay();
    });

    window.addEventListener('keydown', function (e) {
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            saveProjectToBrowser();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
            if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
                return;
            }
            e.preventDefault();
            copyToClipboard();
            return false;
        }
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName ===
            'TEXTAREA') return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const sel = getSelectedLayer();
            if (sel && state.layers.length > 1) {
                deleteLayer(sel.id);
                e.preventDefault();
            }
        }
        if (e.key === 'ArrowUp' && e.shiftKey) {
            const sel = getSelectedLayer();
            if (sel) {
                sel.yPct = state.allowOutOfBounds ? sel.yPct - 1 : Math.max(0, sel.yPct - 1);
                renderCanvas();
                renderPropsPanel();
                persistStateIfEnabled();
                e.preventDefault();
            }
        }
        if (e.key === 'ArrowDown' && e.shiftKey) {
            const sel = getSelectedLayer();
            if (sel) {
                sel.yPct = state.allowOutOfBounds ? sel.yPct + 1 : Math.min(100, sel.yPct + 1);
                renderCanvas();
                renderPropsPanel();
                persistStateIfEnabled();
                e.preventDefault();
            }
        }
        if (e.key === 'ArrowLeft' && e.shiftKey) {
            const sel = getSelectedLayer();
            if (sel) {
                sel.xPct = state.allowOutOfBounds ? sel.xPct - 1 : Math.max(0, sel.xPct - 1);
                renderCanvas();
                renderPropsPanel();
                persistStateIfEnabled();
                e.preventDefault();
            }
        }
        if (e.key === 'ArrowRight' && e.shiftKey) {
            const sel = getSelectedLayer();
            if (sel) {
                sel.xPct = state.allowOutOfBounds ? sel.xPct + 1 : Math.min(100, sel.xPct + 1);
                renderCanvas();
                renderPropsPanel();
                persistStateIfEnabled();
                e.preventDefault();
            }
        }
        if (e.ctrlKey && e.key === 'd') {
            const sel = getSelectedLayer();
            if (sel) {
                duplicateLayer(sel.id);
                e.preventDefault();
            }
        }
    });

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 1800);
    }

    function showConfirmDialog(options = {}) {
        const {
            title = '确认操作',
            message = '确定要继续吗？',
            confirmText = '确认',
            cancelText = '取消',
            onConfirm = null,
        } = options;

        confirmModalTitle.textContent = title;
        confirmModalMessage.textContent = message;
        confirmModalConfirmBtn.textContent = confirmText;
        confirmModalCancelBtn.textContent = cancelText;

        confirmModalOverlay.classList.add('active');

        confirmModalConfirmBtn.onclick = function () {
            confirmModalOverlay.classList.remove('active');
            if (typeof onConfirm === 'function') onConfirm();
        };

        confirmModalCancelBtn.onclick = function () {
            confirmModalOverlay.classList.remove('active');
        };

        confirmModalOverlay.onclick = function (e) {
            if (e.target === confirmModalOverlay) {
                confirmModalOverlay.classList.remove('active');
            }
        };
    }

    function exportImage(format) {
        const savedSelectedId = state.selectedLayerId;
        state.selectedLayerId = null;
        renderCanvasSilent();
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpg' ? 0.95 : undefined;
        const dataUrl = mainCanvas.toDataURL(mimeType, quality);
        state.selectedLayerId = savedSelectedId;
        renderCanvas();
        const ext = format === 'jpg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.download = 'ProdPicStudio_images_' + state.internalWidth + 'x' + state.internalHeight + '_' + Date.now() + '.' + ext;
        link.href = dataUrl;
        link.click();
        showToast('已下载 ' + ext.toUpperCase() + ' 图片 (' + state.internalWidth + 'x' + state.internalHeight +
            ')');
    }

    function saveProjectToBrowser() {
        if (!state.persistenceEnabled) {
            state.persistenceEnabled = true;
            localStorage.setItem('app_persistence_enabled', '1');
            updatePersistenceUI();
            updateSettingsMenuChecks();
            showToast('已自动开启持久化保存并保存到浏览器');
        } else {
            showToast('已保存到浏览器');
        }
        persistStateIfEnabled();
    }

    function renderCanvasSilent() {
        const w = state.internalWidth;
        const h = state.internalHeight;
        mainCanvas.width = w;
        mainCanvas.height = h;
        ctx.clearRect(0, 0, w, h);
        if (state.bgType === 'solid') {
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(0, 0, w, h);
        } else {
            let gradient;
            const c1 = state.bgGradColor1;
            const c2 = state.bgGradColor2;
            const dir = state.bgGradDirection;
            if (dir === 'radial') {
                gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.5);
            } else {
                const [x1, y1, x2, y2] = getGradientCoords(dir, w, h);
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            }
            gradient.addColorStop(0, c1);
            gradient.addColorStop(1, c2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }
        state.layers.forEach(layer => {
            if (!layer.visible) return;
            const px = (layer.xPct / 100) * w;
            const py = (layer.yPct / 100) * h;
            if (layer.type === 'text') drawTextLayer(layer, px, py, w, h);
            else if (layer.type === 'image') drawImageLayer(layer, px, py, w, h);
        });
        // 绘制水印
        drawWatermark(ctx, w, h);
    }

    async function copyToClipboard() {
        try {
            const savedSelectedId = state.selectedLayerId;
            state.selectedLayerId = null;
            renderCanvasSilent();
            const blob = await new Promise(resolve => mainCanvas.toBlob(resolve, 'image/png'));
            state.selectedLayerId = savedSelectedId;
            renderCanvas();
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('已复制到剪贴板');
            }
        } catch (err) {
            showToast('复制失败，请尝试下载');
            console.error('Clipboard write failed:', err);
        }
    }

    window.toggleSection = function (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.toggle('open');
        }
    };

    window.toggleSidebar = function () {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        if (state.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
        updateSidebarToggleMenuText();
        setTimeout(() => updatePreviewDisplay(), 350);
        persistStateIfEnabled();
    };

    window.toggleSidebarFromMenu = function () {
        toggleSidebar();
        updateSidebarToggleMenuText();
    };

    window.toggleDarkMode = function () {
        state.darkMode = !state.darkMode;
        document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
        updateSettingsMenuChecks();
        updatePreviewCheckerboard();
        persistStateIfEnabled();
        showToast(state.darkMode ? '已切换深色模式' : '已切换浅色模式');
    };

    function updatePreviewCheckerboard() {
        const isDark = state.darkMode;
        const light = isDark ? '#2a2d35' : '#dde1e7';
        const dark = isDark ? '#333840' : '#e8ecf1';
        previewArea.style.backgroundImage =
            `linear-gradient(45deg, ${light} 25%, transparent 25%),` +
            `linear-gradient(-45deg, ${light} 25%, transparent 25%),` +
            `linear-gradient(45deg, transparent 75%, ${light} 75%),` +
            `linear-gradient(-45deg, transparent 75%, ${light} 75%)`;
    }

    window.onCanvasRatioChange = function () {
        state.ratio = document.getElementById('canvasRatio').value;
        updateInternalSize();
        state.previewZoom = 1;
        updatePreviewDisplay();
        renderCanvas();
        persistStateIfEnabled();
    };

    window.onQualityChange = function () {
        state.quality = document.getElementById('quality').value;
        updateInternalSize();
        state.previewZoom = 1;
        updatePreviewDisplay();
        renderCanvas();
        persistStateIfEnabled();
    };

    window.onBgTypeChange = function () {
        state.bgType = document.getElementById('bgType').value;
        document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
        document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';
        scheduleRender();
    };


    function syncWatermarkUI() {
        document.getElementById('watermarkEnabled').checked = state.watermarkEnabled;
        document.getElementById('watermarkText').value = state.watermarkText;
        document.getElementById('watermarkColor').value = state.watermarkColor;
        const opacityPct = Math.round(state.watermarkOpacity * 100);
        document.getElementById('watermarkOpacityNum').value = opacityPct;
        document.getElementById('watermarkOpacityRange').value = opacityPct;
        document.getElementById('watermarkFontSizeNum').value = state.watermarkFontSize;
        document.getElementById('watermarkFontSizeRange').value = state.watermarkFontSize;
        document.getElementById('watermarkRotationNum').value = state.watermarkRotation;
        document.getElementById('watermarkRotationRange').value = state.watermarkRotation;
        document.getElementById('watermarkPosition').value = state.watermarkPosition;
        document.getElementById('watermarkGapX').value = state.watermarkGapX;
        document.getElementById('watermarkGapY').value = state.watermarkGapY;
        // 动态重建字体下拉列表
        buildWatermarkFontSelect();
        updateWatermarkSettingsVisibility();
        updateWatermarkTileVisibility();
    }

    function buildWatermarkFontSelect() {
        const sel = document.getElementById('watermarkFontFamily');
        if (!sel) return;
        const currentVal = state.watermarkFontFamily;
        sel.innerHTML = '';
        if (state.showBuiltinFonts) {
            CONFIG.fonts.forEach(f => {
                if (f.value === 'system-ui, sans-serif') return;
                const opt = document.createElement('option');
                opt.value = f.value;
                opt.textContent = f.label;
                if (f.value === currentVal) opt.selected = true;
                sel.appendChild(opt);
            });
        }
        const sysOpt = document.createElement('option');
        sysOpt.value = 'system-ui, sans-serif';
        sysOpt.textContent = '系统默认';
        if ('system-ui, sans-serif' === currentVal) sysOpt.selected = true;
        sel.appendChild(sysOpt);
        if (customFonts.length > 0) {
            const sep = document.createElement('option');
            sep.disabled = true;
            sep.textContent = '──── 自定义 ────';
            sel.appendChild(sep);
            customFonts.forEach(cf => {
                const opt = document.createElement('option');
                opt.value = cf.value;
                opt.textContent = cf.label;
                if (cf.value === currentVal) opt.selected = true;
                sel.appendChild(opt);
            });
        }
    }

    function updateWatermarkSettingsVisibility() {
        const group = document.getElementById('watermarkSettingsGroup');
        if (group) group.style.display = state.watermarkEnabled ? 'block' : 'none';
    }

    function updateWatermarkTileVisibility() {
        const tileSettings = document.getElementById('watermarkTileSettings');
        if (tileSettings) tileSettings.style.display = state.watermarkPosition === 'tile' ? 'block' : 'none';
    }

    function drawWatermark(ctx, w, h) {
        if (!state.watermarkEnabled) return;
        if (!state.watermarkText || state.watermarkText.trim() === '') return;

        ctx.save();
        ctx.globalAlpha = state.watermarkOpacity;
        ctx.fillStyle = state.watermarkColor;
        ctx.font = 'bold ' + state.watermarkFontSize + 'px ' + state.watermarkFontFamily;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = state.watermarkText;
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = state.watermarkFontSize;

        const position = state.watermarkPosition;
        const rotation = state.watermarkRotation * Math.PI / 180;

        if (position === 'tile') {
            const gapX = (state.watermarkGapX / 100) * w;
            const gapY = (state.watermarkGapY / 100) * h;
            const stepX = textWidth + gapX;
            const stepY = textHeight * 2 + gapY;

            for (let y = stepY / 2; y < h + stepY; y += stepY) {
                for (let x = stepX / 2; x < w + stepX; x += stepX) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    ctx.fillText(text, 0, 0);
                    ctx.restore();
                }
            }
        } else {
            let px, py;
            const margin = textWidth * 0.6;
            switch (position) {
                case 'center':
                    px = w / 2; py = h / 2;
                    break;
                case 'top-left':
                    px = margin; py = textHeight;
                    break;
                case 'top-right':
                    px = w - margin; py = textHeight;
                    break;
                case 'bottom-left':
                    px = margin; py = h - textHeight;
                    break;
                case 'bottom-right':
                    px = w - margin; py = h - textHeight;
                    break;
                default:
                    px = w / 2; py = h / 2;
            }
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(rotation);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }

    window.onWatermarkEnabledChange = function () {
        state.watermarkEnabled = document.getElementById('watermarkEnabled').checked;
        updateWatermarkSettingsVisibility();
        renderCanvas();
        persistStateIfEnabled();
    };

    window.onWatermarkChange = function (sourceEl) {
        // 处理不透明度
        if (sourceEl && (sourceEl.id === 'watermarkOpacityNum' || sourceEl.id === 'watermarkOpacityRange')) {
            const container = sourceEl.closest('.font-size-control');
            if (container) {
                const numInput = container.querySelector('input[type="number"]');
                const rangeInput = container.querySelector('input[type="range"]');
                if (sourceEl.type === 'range') {
                    numInput.value = sourceEl.value;
                } else {
                    rangeInput.value = sourceEl.value;
                }
                state.watermarkOpacity = parseInt(numInput.value) / 100;
            }
        }
        // 处理字号
        if (sourceEl && (sourceEl.id === 'watermarkFontSizeNum' || sourceEl.id === 'watermarkFontSizeRange')) {
            const container = sourceEl.closest('.font-size-control');
            if (container) {
                const numInput = container.querySelector('input[type="number"]');
                const rangeInput = container.querySelector('input[type="range"]');
                if (sourceEl.type === 'range') {
                    numInput.value = sourceEl.value;
                } else {
                    rangeInput.value = sourceEl.value;
                }
                state.watermarkFontSize = parseInt(numInput.value) || 36;
            }
        }
        // 处理旋转角度
        if (sourceEl && (sourceEl.id === 'watermarkRotationNum' || sourceEl.id === 'watermarkRotationRange')) {
            const container = sourceEl.closest('.font-size-control');
            if (container) {
                const numInput = container.querySelector('input[type="number"]');
                const rangeInput = container.querySelector('input[type="range"]');
                if (sourceEl.type === 'range') {
                    numInput.value = sourceEl.value;
                } else {
                    rangeInput.value = sourceEl.value;
                }
                state.watermarkRotation = parseInt(numInput.value) || 0;
            }
        }

        // 非滑块触发的属性直接从DOM读取
        if (!sourceEl || !['watermarkOpacityNum', 'watermarkOpacityRange', 'watermarkFontSizeNum', 'watermarkFontSizeRange', 'watermarkRotationNum', 'watermarkRotationRange'].includes(sourceEl.id)) {
            state.watermarkText = document.getElementById('watermarkText').value;
            state.watermarkColor = document.getElementById('watermarkColor').value;
            state.watermarkFontFamily = document.getElementById('watermarkFontFamily').value;
            state.watermarkPosition = document.getElementById('watermarkPosition').value;
            state.watermarkGapX = parseInt(document.getElementById('watermarkGapX').value) || 35;
            state.watermarkGapY = parseInt(document.getElementById('watermarkGapY').value) || 30;
        }

        updateWatermarkTileVisibility();
        renderCanvas();
        persistStateIfEnabled();
    };

    document.getElementById('bgColor').addEventListener('input', function () {
        state.bgColor = this.value;
        scheduleRender();
    });
    document.getElementById('bgGradColor1').addEventListener('input', function () {
        state.bgGradColor1 = this.value;
        scheduleRender();
    });
    document.getElementById('bgGradColor2').addEventListener('input', function () {
        state.bgGradColor2 = this.value;
        scheduleRender();
    });
    document.getElementById('bgGradDirection').addEventListener('change', function () {
        state.bgGradDirection = this.value;
        scheduleRender();
    });

    window.applyTemplate = function (templateKey) {
        const tpl = templates[templateKey];
        if (!tpl) return;
        applyTemplateData(tpl);
    };

    // 模板数据
    let templates = {};

    // 加载默认配置
    async function loadDefaultConfig() {
        CONFIG._loaded = true;
        // 用内联默认配置默认值 后续loadPersistedState()会再覆盖为用户保存的值
        const d = CONFIG.defaults;
        state.ratio = d.ratio;
        state.quality = d.quality;
        state.bgType = d.bgType;
        state.bgColor = d.bgColor;
        state.bgGradColor1 = d.bgGradColor1;
        state.bgGradColor2 = d.bgGradColor2;
        state.bgGradDirection = d.bgGradDirection;
        state.darkMode = d.darkMode;
        state.sidebarCollapsed = d.sidebarCollapsed;
        state.allowOutOfBounds = d.allowOutOfBounds;
        state.alwaysFreeSelect = d.alwaysFreeSelect;
        state.showBuiltinTemplates = d.showBuiltinTemplates;
        state.showBuiltinFonts = d.showBuiltinFonts;
        state.previewZoom = d.previewZoom;
        state.watermarkEnabled = d.watermarkEnabled;
        state.watermarkText = d.watermarkText;
        state.watermarkColor = d.watermarkColor;
        state.watermarkOpacity = d.watermarkOpacity;
        state.watermarkFontSize = d.watermarkFontSize;
        state.watermarkFontFamily = d.watermarkFontFamily;
        state.watermarkPosition = d.watermarkPosition;
        state.watermarkRotation = d.watermarkRotation;
        state.watermarkGapX = d.watermarkGapX;
        state.watermarkGapY = d.watermarkGapY;

        if (!presetBgs || presetBgs.length === 0) {
            presetBgs = JSON.parse(JSON.stringify(CONFIG.presetBgs));
            savePresetBgs(presetBgs);
        }
        templates = CONFIG.templates;
        renderTemplatePresetDropdown();
    }

    window.addTextLayer = function () {
        const count = state.layers.filter(l => l.type === 'text').length;
        const tld = CONFIG.textLayerDefaults;
        const layer = createTextLayer('文字图层 ' + (count + 1), '新文字', 50, 30 + count * 8,
            tld.fontSize, tld.color, tld.fontFamily, tld.fontWeight);
        state.layers.push(layer);
        state.selectedLayerId = layer.id;
        renderLayerList();
        renderPropsPanel();
        renderCanvas();
        persistStateIfEnabled();
        showToast('已添加文字图层');
        document.getElementById('sectionProps').classList.add('open');
        propsBody.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    window.addImageLayer = function () {
        imageFileInput.setAttribute('data-layer-id', 'new');
        imageFileInput.click();
    };

    window.handleImageUpload = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        // 在异步回调之前同步读取目标图层ID 避免被下方的重置覆盖
        const targetLayerId = imageFileInput.getAttribute('data-layer-id') || 'new';
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            const tempImg = new Image();
            tempImg.onload = function () {
                if (targetLayerId === 'new') {
                    const count = state.layers.filter(l => l.type === 'image').length;
                    const layer = createImageLayer(file.name || '图片 ' + (count + 1), dataUrl, 50, 45,
                        28, tempImg.naturalWidth, tempImg.naturalHeight);
                    layer.imgObj = tempImg;
                    state.layers.push(layer);
                    state.selectedLayerId = layer.id;
                } else {
                    const existingLayer = getLayerById(targetLayerId);
                    if (existingLayer && existingLayer.type === 'image') {
                        existingLayer.src = dataUrl;
                        existingLayer.imgObj = tempImg;
                        existingLayer.originalWidth = tempImg.naturalWidth;
                        existingLayer.originalHeight = tempImg.naturalHeight;
                        existingLayer.name = file.name || existingLayer.name;
                        state.selectedLayerId = existingLayer.id;
                    }
                }
                renderLayerList();
                renderPropsPanel();
                renderCanvas();
                persistStateIfEnabled();
                showToast('图片已加载: ' + (file.name || '图片'));
            };
            tempImg.src = dataUrl;
        };
        reader.readAsDataURL(file);
        imageFileInput.value = '';
        imageFileInput.setAttribute('data-layer-id', 'new');
    };

    window.exportProject = function () {
        const projectData = {
            version: '1.0',
            timestamp: Date.now(),
            ratio: state.ratio,
            quality: state.quality,
            bgType: state.bgType,
            bgColor: state.bgColor,
            bgGradColor1: state.bgGradColor1,
            bgGradColor2: state.bgGradColor2,
            bgGradDirection: state.bgGradDirection,
            layers: state.layers.map(serializeLayer),
            watermarkEnabled: state.watermarkEnabled,
            watermarkText: state.watermarkText,
            watermarkColor: state.watermarkColor,
            watermarkOpacity: state.watermarkOpacity,
            watermarkFontSize: state.watermarkFontSize,
            watermarkFontFamily: state.watermarkFontFamily,
            watermarkPosition: state.watermarkPosition,
            watermarkRotation: state.watermarkRotation,
            watermarkGapX: state.watermarkGapX,
            watermarkGapY: state.watermarkGapY,
        };
        const jsonStr = JSON.stringify(projectData);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'ProdPicStudio_project_' + new Date().toISOString().slice(0, 19) + '.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showToast('工程文件已导出');
    };

    window.exportAsTemplate = function () {
        const tplName = prompt('请输入模板名称: ', '我的模板');
        if (tplName === null) return; // User cancelled
        const name = tplName.trim() || '我的模板';
        const templateData = {
            type: 'template',
            name: name,
            timestamp: Date.now(),
            data: {
                bgType: state.bgType,
                bgColor: state.bgColor,
                bgGradColor1: state.bgGradColor1,
                bgGradColor2: state.bgGradColor2,
                bgGradDirection: state.bgGradDirection,
                layers: state.layers.map(serializeLayer),
            },
        };
        const jsonStr = JSON.stringify(templateData);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'ProdPicStudio_template_' + new Date().toISOString().slice(0, 19) + '.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showToast('模板文件已导出');
    };

    window.importProject = function () {
        projectFileInput.click();
    };

    window.importTemplateFile = function () {
        templateFileInput.click();
    };

    window.importTempTemplate = function () {
        tempTemplateFileInput.click();
    };

    window.handleTempTemplateImport = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                let tplData = null;
                let tplName = '临时模板';
                if (data.type === 'template' && data.name && data.data) {
                    tplData = data.data;
                    tplName = data.name;
                } else if (data.data && !data.type) {
                    tplData = data.data;
                    tplName = data.name || tplName;
                } else if (data.layers && data.version) {
                    tplData = data;
                } else {
                    throw new Error('不支持的文件格式');
                }
                if (tplData) {
                    applyTemplateData(tplData);
                    showToast('已应用临时模板: ' + tplName);
                }
            } catch (err) {
                showToast('导入临时模板失败: 文件格式错误');
                console.error('Temp template import error:', err);
            }
        };
        reader.readAsText(file);
        tempTemplateFileInput.value = '';
    };

    window.handleTemplateImport = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                let importedCount = 0;
                if (data.type === 'config' && data.customTemplates && Array.isArray(data.customTemplates)) {
                    data.customTemplates.forEach(ct => {
                        if (ct.name && ct.data) {
                            if (!customTemplates.some(t => t.name === ct.name && t.createdAt === ct.createdAt)) {
                                customTemplates.push(ct);
                                importedCount++;
                            }
                        }
                    });
                } else if (data.type === 'template' && data.name && data.data) {
                    if (!customTemplates.some(t => t.name === data.name)) {
                        customTemplates.push({ name: data.name, data: data.data, createdAt: Date.now() });
                        importedCount++;
                    }
                } else if (Array.isArray(data)) {
                    data.forEach(ct => {
                        if (ct.name && ct.data) {
                            if (!customTemplates.some(t => t.name === ct.name && t.createdAt === ct.createdAt)) {
                                customTemplates.push(ct);
                                importedCount++;
                            }
                        }
                    });
                } else {
                    throw new Error('不支持的模板文件格式');
                }
                if (importedCount > 0) {
                    saveCustomTpls(customTemplates);
                    renderTemplatePresetDropdown();
                    showToast('成功导入 ' + importedCount + ' 个模板');
                } else {
                    showToast('未导入新模板（可能已存在或格式不符）');
                }
            } catch (err) {
                showToast('导入模板失败: 文件格式错误');
                console.error('Template import error:', err);
            }
        };
        reader.readAsText(file);
        templateFileInput.value = '';
    };

    window.handleProjectImport = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const projectData = JSON.parse(e.target.result);
                if (!projectData.version || !projectData.layers) {
                    throw new Error('无效的工程文件格式');
                }
                const d = CONFIG.defaults;
                state.ratio = projectData.ratio || d.ratio;
                state.quality = projectData.quality || d.quality;
                state.bgType = projectData.bgType || d.bgType;
                state.bgColor = projectData.bgColor || d.bgColor;
                state.bgGradColor1 = projectData.bgGradColor1 || d.bgGradColor1;
                state.bgGradColor2 = projectData.bgGradColor2 || d.bgGradColor2;
                state.bgGradDirection = projectData.bgGradDirection || d.bgGradDirection;
                state.watermarkEnabled = projectData.watermarkEnabled ?? d.watermarkEnabled;
                state.watermarkText = projectData.watermarkText || d.watermarkText;
                state.watermarkColor = projectData.watermarkColor || d.watermarkColor;
                state.watermarkOpacity = projectData.watermarkOpacity ?? d.watermarkOpacity;
                state.watermarkFontSize = projectData.watermarkFontSize || d.watermarkFontSize;
                state.watermarkFontFamily = projectData.watermarkFontFamily || d.watermarkFontFamily;
                state.watermarkPosition = projectData.watermarkPosition || d.watermarkPosition;
                state.watermarkRotation = projectData.watermarkRotation ?? d.watermarkRotation;
                state.watermarkGapX = projectData.watermarkGapX || d.watermarkGapX;
                state.watermarkGapY = projectData.watermarkGapY || d.watermarkGapY;
                document.getElementById('canvasRatio').value = state.ratio;
                document.getElementById('quality').value = state.quality;
                document.getElementById('bgType').value = state.bgType;
                document.getElementById('bgColor').value = state.bgColor;
                document.getElementById('bgGradColor1').value = state.bgGradColor1;
                document.getElementById('bgGradColor2').value = state.bgGradColor2;
                document.getElementById('bgGradDirection').value = state.bgGradDirection;
                document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
                document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';
                updateInternalSize();

                state.layers = [];
                state.layerIdCounter = 0;
                projectData.layers.forEach(layerData => {
                    const layer = parseLayerData(layerData);
                    if (layer) {
                        state.layers.push(layer);
                        if (layer.type === 'image' && layerData.src) {
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            img.onload = () => { layer.imgObj = img; renderCanvas(); };
                            img.src = layerData.src;
                        }
                    }
                });
                state.selectedLayerId = state.layers.length > 0 ? state.layers[0].id : null;
                state.previewZoom = 1;
                renderLayerList();
                renderPropsPanel();
                syncWatermarkUI();
                updatePreviewDisplay();
                renderCanvas();
                persistStateIfEnabled();
                showToast('工程文件已导入 (' + state.layers.length + ' 个图层)');
            } catch (err) {
                showToast('导入失败: 文件格式错误');
                console.error('Project import error:', err);
            }
        };
        reader.readAsText(file);
        projectFileInput.value = '';
    };

    window.resetAll = function () {
        showConfirmDialog({
            title: '删除所有图层',
            message: '确定要删除所有图层吗？\n此操作不可撤销',
            confirmText: '删除',
            onConfirm: function () {
                state.layers = [];
                state.layerIdCounter = 0;
                state.selectedLayerId = null;
                state.bgType = 'solid';
                state.bgColor = '#1a1a2e';
                state.bgGradColor1 = '#4f6ef7';
                state.bgGradColor2 = '#a855f7';
                state.bgGradDirection = 'top-bottom';
                state.previewZoom = 1;
                document.getElementById('bgType').value = 'solid';
                document.getElementById('bgColor').value = '#1a1a2e';
                document.getElementById('bgGradColor1').value = '#4f6ef7';
                document.getElementById('bgGradColor2').value = '#a855f7';
                document.getElementById('bgGradDirection').value = 'top-bottom';
                document.getElementById('bgSolidGroup').style.display = 'block';
                document.getElementById('bgGradientGroup').style.display = 'none';
                renderLayerList();
                renderPropsPanel();
                renderCanvas();
                updatePreviewDisplay();
                persistStateIfEnabled();
                showToast('已删除所有图层');
            }
        });
    };

    // 重置所有设置
    async function resetToDefaultConfig() {
        // 清空所有用户持久化数据
        try {
            localStorage.removeItem('app_persistence_enabled');
            localStorage.removeItem('app_persistent_state');
            localStorage.removeItem('app_custom_templates');
            localStorage.removeItem('app_preset_bgs');
            localStorage.removeItem('app_custom_fonts');
            localStorage.removeItem('app_builtin_fonts');
            localStorage.removeItem('app_welcome_dont_show_until');
            localStorage.removeItem('app_archive_active_slot');
            for (let i = 0; i < 5; i++) {
                localStorage.removeItem('app_archive_slot_' + i);
            }
        } catch (e) { }

        // 使用CONFIG内联默认配置
        CONFIG._loaded = true;

        // 重置运行时数据
        presetBgs = JSON.parse(JSON.stringify(CONFIG.presetBgs));
        savePresetBgs(presetBgs);
        customTemplates = [];
        saveCustomTpls(customTemplates);
        customFonts = [];
        saveCustomFonts(customFonts);
        templates = CONFIG.templates;

        // 重置state到默认配置
        const d = CONFIG.defaults;
        state.ratio = d.ratio;
        state.quality = d.quality;
        state.bgType = d.bgType;
        state.bgColor = d.bgColor;
        state.bgGradColor1 = d.bgGradColor1;
        state.bgGradColor2 = d.bgGradColor2;
        state.bgGradDirection = d.bgGradDirection;
        state.darkMode = d.darkMode;
        state.sidebarCollapsed = d.sidebarCollapsed;
        state.persistenceEnabled = d.persistenceEnabled;
        state.allowOutOfBounds = d.allowOutOfBounds;
        state.alwaysFreeSelect = d.alwaysFreeSelect;
        state.showBuiltinTemplates = d.showBuiltinTemplates;
        state.showBuiltinFonts = d.showBuiltinFonts;
        state.resizeHandlesEnabled = d.resizeHandlesEnabled;
        state.previewZoom = d.previewZoom;
        state.layers = [];
        state.layerIdCounter = 0;
        state.selectedLayerId = null;
        state.activeArchiveSlot = 0;

        // 同步UI控件
        document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
        document.getElementById('canvasRatio').value = state.ratio;
        document.getElementById('quality').value = state.quality;
        document.getElementById('bgType').value = state.bgType;
        document.getElementById('bgColor').value = state.bgColor;
        document.getElementById('bgGradColor1').value = state.bgGradColor1;
        document.getElementById('bgGradColor2').value = state.bgGradColor2;
        document.getElementById('bgGradDirection').value = state.bgGradDirection;
        document.getElementById('bgSolidGroup').style.display = state.bgType === 'solid' ? 'block' : 'none';
        document.getElementById('bgGradientGroup').style.display = state.bgType === 'gradient' ? 'block' : 'none';
        sidebar.classList.remove('collapsed');

        renderPresetBgButtons();
        renderTemplatePresetDropdown();
        renderPresetBgEditList();
        updateSettingsMenuChecks();
        updateSidebarToggleMenuText();
        updatePersistenceUI();
        updateInternalSize();
        updatePreviewCheckerboard();
        renderCanvas();
        updatePreviewDisplay();
        showToast('已重置所有设置');
    }

    window.resetAllSettings = function () {
        showConfirmDialog({
            title: '重置所有设置',
            message: '确定要重置所有设置吗？\n这会删除所有图层、存档、模板和背景预设等\n此操作不可撤销',
            confirmText: '重置',
            onConfirm: function () {
                resetToDefaultConfig();
            }
        });
    };

    async function init() {
        updateInternalSize();
        loadPersistenceSetting();
        await loadDefaultConfig();
        // 加载持久化的内置字体
        CONFIG.fonts = loadFromStorage('app_builtin_fonts', () => JSON.parse(JSON.stringify(CONFIG.fonts)));

        // 恢复上次活跃的存档槽
        state.activeArchiveSlot = loadFromStorage('app_archive_active_slot', 0);

        let loadedFromPersistence = false;
        if (state.persistenceEnabled) {
            loadedFromPersistence = loadPersistedState();
        }

        // 从当前活跃存档槽加载工程
        if (!loadedFromPersistence) {
            const archiveData = loadFromStorage(ARCHIVE_STORAGE_PREFIX + state.activeArchiveSlot, null);
            if (archiveData) {
                loadArchiveData(archiveData, state.activeArchiveSlot);
                loadedFromPersistence = true;
            }
        }

        if (!loadedFromPersistence) {
            state.layers = [
                createTextLayer('主标题', 'Hi! 欢迎来到ProdPic Studio!', 50, 28, 72, '#ffffff',
                    'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', 'bold'),
                createTextLayer('子标题', '点击上方选项卡以加载模板', 50, 42, 36, '#e0e7ff',
                    'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', 'normal'),
                createTextLayer('底部栏目', 'Made by pipicat613', 50, 88, 22, '#aab4cc',
                    'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif', 'normal'),
            ];
            state.layers[2].shadowEnabled = false;
            state.selectedLayerId = state.layers[0].id;
            document.getElementById('bgSolidGroup').style.display = 'block';
            document.getElementById('bgGradientGroup').style.display = 'none';
        }

        document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
        updateSettingsMenuChecks();
        updatePreviewCheckerboard();
        updateSidebarToggleMenuText();

        if (state.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        }

        renderPresetBgButtons();
        renderLayerList();
        renderPropsPanel();
        syncWatermarkUI();
        renderCanvas();
        updatePreviewDisplay();

        if (shouldShowWelcome()) {
            setTimeout(() => {
                welcomeModalOverlay.classList.add('active');
            }, 600);
        }

        if (state.persistenceEnabled && !loadedFromPersistence) {
            persistStateIfEnabled();
        }
    }

    window.exportImage = exportImage;
    window.copyToClipboard = copyToClipboard;
    window.exportProject = exportProject;
    window.exportAsTemplate = exportAsTemplate;
    window.importProject = importProject;
    window.importTempTemplate = importTempTemplate;
    window.handleTempTemplateImport = handleTempTemplateImport;
    window.resetAll = resetAll;
    window.resetAllSettings = resetAllSettings;
    window.addTextLayer = addTextLayer;
    window.addImageLayer = addImageLayer;
    window.handleImageUpload = handleImageUpload;
    window.handleProjectImport = handleProjectImport;
    window.handleTemplateImport = handleTemplateImport;
    window.importTemplateFile = importTemplateFile;
    window.applyTemplate = applyTemplate;
    window.onCanvasRatioChange = onCanvasRatioChange;
    window.onQualityChange = onQualityChange;
    window.onBgTypeChange = onBgTypeChange;
    window.toggleDarkMode = toggleDarkMode;
    window.toggleDarkModeFromMenu = toggleDarkModeFromMenu;
    window.togglePersistence = togglePersistence;
    window.exportConfigFile = exportConfigFile;
    window.editPresetBgList = editPresetBgList;
    window.showTutorialModal = showTutorialModal;
    window.showAboutModal = showAboutModal;
    window.addCustomTemplate = addCustomTemplate;
    window.saveCustomTemplate = saveCustomTemplate;
    window.closeCustomTemplateModal = closeCustomTemplateModal;
    window.toggleDropdown = toggleDropdown;
    window.closeAllDropdowns = closeAllDropdowns;
    window.toggleSection = toggleSection;
    window.toggleSidebar = toggleSidebar;
    window.toggleSidebarFromMenu = toggleSidebarFromMenu;
    window.scheduleRender = scheduleRender;
    window.closeWelcomeModal = closeWelcomeModal;
    window.closeTutorialModal = closeTutorialModal;
    window.closeAboutModal = closeAboutModal;
    window.closePresetBgModal = closePresetBgModal;
    window.addPresetBg = addPresetBg;
    window._centerLayerHorizontal = _centerLayerHorizontal;
    window._centerLayerVertical = _centerLayerVertical;
    window.toggleAllowOutOfBounds = toggleAllowOutOfBounds;
    window.toggleAlwaysFreeSelect = toggleAlwaysFreeSelect;
    window.toggleShowBuiltinTemplates = toggleShowBuiltinTemplates;
    window.toggleShowBuiltinFonts = toggleShowBuiltinFonts;
    window.importConfigFile = importConfigFile;
    window.handleConfigImport = handleConfigImport;
    window.showFaqModal = showFaqModal;
    window.closeFaqModal = closeFaqModal;
    window.editFontList = editFontList;
    window.openAddFontModal = openAddFontModal;
    window.saveAddFont = saveAddFont;
    window.closeAddFontModal = closeAddFontModal;
    window.closeFontListModal = closeFontListModal;
    window.onAddPresetBgTypeChange = onAddPresetBgTypeChange;
    window.saveAddPresetBg = saveAddPresetBg;
    window.closeAddPresetBgModal = closeAddPresetBgModal;

    init();
})();
