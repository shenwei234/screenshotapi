const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

// 启动 Puppeteer
const getScreenshot = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    return screenshot;
};

// 处理快照请求
app.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL 参数缺失');
    }

    try {
        const screenshot = await getScreenshot(url);
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        res.status(500).send('无法生成快照');
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`API 服务运行在 http://localhost:${port}`);
});
