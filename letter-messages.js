// 从 letter-messages.txt 加载内容
let MESSAGES = [];

fetch('letter-messages.txt')
    .then(response => response.text())
    .then(text => {
        // 把每一行解析成 {type, text, author}
        MESSAGES = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                const parts = line.split('|');
                const type = parts[0];
                const text = parts[1] || '';
                const author = parts[2] || '';
                return { type, text, author };
            });

        // 数据加载完后再显示今日份
        showTodayMessage();
    });

// 显示今日份
function showTodayMessage() {
    if (MESSAGES.length === 0) return;

    const STORAGE_KEY = 'letter_used_idx';

    function getUnusedIndices(needCount) {
        let used = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        let available = [];
        for (let i = 0; i < MESSAGES.length; i++) {
            if (!used.includes(i)) available.push(i);
        }
        if (available.length < needCount) {
            used = [];
            available = Array.from({length: MESSAGES.length}, (_, i) => i);
        }
        const result = [];
        for (let n = 0; n < needCount && available.length > 0; n++) {
            const idx = Math.floor(Math.random() * available.length);
            result.push(available[idx]);
            available.splice(idx, 1);
        }
        const newUsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').concat(result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsed));
        return result;
    }

    const todayIndices = getUnusedIndices(1);
    const todayContent = MESSAGES[todayIndices[0]];

    const typeLabel =
        todayContent.type === 'tip' ? '💡 小贴士' :
        todayContent.type === 'wish' ? '💝 祝福' :
        '✨ 金句';

    document.getElementById('todayTip').innerHTML = `
        <div style="font-size:18px; margin-bottom:8px; color:#8b4513;">${typeLabel}</div>
        <div style="font-size:20px; line-height:1.6;">${todayContent.text}</div>
        ${todayContent.author ? '<div style="font-size:14px; color:#999; margin-top:10px;">—— ' + todayContent.author + '</div>' : ''}
    `;
}
