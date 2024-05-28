import puppeteer from 'puppeteer';
import path from 'path';

const BROWSER_USER_DATA_DIR = process.env.BROWSER_USER_DATA_DIR;
const LOBECHAT_URL = process.env.LOBECHAT_URL ?? "https://chat.lobehub.com/";
const LOBECHAT_ACCESS_CODE = process.env.LOBECHAT_ACCESS_CODE;
const LOBECHAT_SERVER_NAME = process.env.LOBECHAT_SERVER_NAME ?? "Sync Server";
const LOBECHAT_WEBRTC_CHANNEL_NAME = process.env.LOBECHAT_WEBRTC_CHANNEL_NAME;
const LOBECHAT_WEBRTC_CHANNEL_PASSWORD = process.env.LOBECHAT_WEBRTC_CHANNEL_PASSWORD;
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL !== undefined ? parseInt(process.env.REFRESH_INTERVAL) : 60 * 5;

if (!BROWSER_USER_DATA_DIR) throw new Error("BROWSER_USER_DATA_DIR not set");
if (!LOBECHAT_WEBRTC_CHANNEL_NAME) throw new Error("LOBECHAT_WEBRTC_CHANNEL_NAME not set");
if (!LOBECHAT_WEBRTC_CHANNEL_PASSWORD) throw new Error("LOBECHAT_WEBRTC_CHANNEL_PASSWORD not set");

(async () => {

  //=========================================
  //        Launch broswer
  //=========================================
  const browser = await puppeteer.launch({
    userDataDir: BROWSER_USER_DATA_DIR,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  //=========================================
  //        Open page
  //=========================================
  const page = await browser.newPage();

  await page.goto(LOBECHAT_URL);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.setViewport({width: 1920, height: 1080});

  //=========================================
  //        Setup access code
  //=========================================
  if (LOBECHAT_ACCESS_CODE) {
    await page.goto(path.join(LOBECHAT_URL, '/settings/common'));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.type('input[type=password]', LOBECHAT_ACCESS_CODE)
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Access code set.')
  }


  //=========================================
  //        Setup WebRTC
  //=========================================
  await page.goto(path.join(LOBECHAT_URL, '/settings/sync'));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // webrtc_clientName
  await page.click('body > div.ant-app > div > div.layoutkit-flexbox > div.layoutkit-flexbox > div > div.layoutkit-flexbox > div > div.layoutkit-flexbox > div.layoutkit-flexbox > div.layoutkit-flexbox')
  await new Promise((resolve) => setTimeout(resolve, 500))
  await page.$eval('body > div.ant-app > div > div.layoutkit-flexbox > div.layoutkit-flexbox > div > div > div > div.layoutkit-flexbox > div.layoutkit-flexbox > span > input', el => el.value = '');
  await new Promise((resolve) => setTimeout(resolve, 500))
  await page.type('body > div.ant-app > div > div.layoutkit-flexbox > div.layoutkit-flexbox > div > div > div > div.layoutkit-flexbox > div.layoutkit-flexbox > span > input', LOBECHAT_SERVER_NAME)
  await new Promise((resolve) => setTimeout(resolve, 500))
  await page.click('body > div.ant-app > div > div.layoutkit-flexbox > div.layoutkit-flexbox > div > div > div > div.layoutkit-flexbox > div > article')
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log('Server name set.')

  // webrtc_channelName
  const webrtcChannelNameInput = await page.$('#sync_webrtc_channelName');
  const webrtcChannelNameInputValue = await page.evaluate('document.querySelector("#sync_webrtc_channelName").value')
  if (webrtcChannelNameInputValue !== LOBECHAT_WEBRTC_CHANNEL_NAME) {
    await webrtcChannelNameInput.focus()
    await webrtcChannelNameInput.click({ clickCount: 3 })
    await new Promise((resolve) => setTimeout(resolve, 500))
    await page.keyboard.press('Backspace')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await webrtcChannelNameInput.type(LOBECHAT_WEBRTC_CHANNEL_NAME);
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  console.log('WebRTC channel name set.')

  // webrtc_channelPassword
  const webrtcChannelPasswordInput = await page.$('#sync_webrtc_channelPassword');
  const webrtcChannelPasswordInputValue = await page.evaluate('document.querySelector("#sync_webrtc_channelPassword").value')
  if (webrtcChannelPasswordInputValue !== LOBECHAT_WEBRTC_CHANNEL_PASSWORD) {
    await webrtcChannelPasswordInput.focus()
    await webrtcChannelPasswordInput.click({ clickCount: 3 })
    await new Promise((resolve) => setTimeout(resolve, 500))
    await page.keyboard.press('Backspace')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await webrtcChannelPasswordInput.type(LOBECHAT_WEBRTC_CHANNEL_PASSWORD);
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  console.log('WebRTC channel password set.')

  // webrtc_enabled
  const webrtcEnableButtonElement = await page.locator('#sync_webrtc_enabled')
  const webrtcEnableButtonEnabled = await page.evaluate('document.querySelector("#sync_webrtc_enabled").getAttribute("aria-checked")') === 'true'
  if (webrtcEnableButtonEnabled) {
    await webrtcEnableButtonElement.click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await webrtcEnableButtonElement.click()
    await new Promise((resolve) => setTimeout(resolve, 500))
  } else {
    await webrtcEnableButtonElement.click()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  console.log('WebRTC sync enabled.')

  await page.goto(path.join(LOBECHAT_URL, '/chat'))
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Page initialized.')

  //=========================================
  //        Reload page regularly
  //=========================================
  if (REFRESH_INTERVAL > 0) {
    setInterval(async () => {
      try {
        await page.goto(path.join(LOBECHAT_URL, '/chat'))
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await page.reload()

        console.log('Page reloaded.')
      } catch (error) {
        console.warn("Failed to reload page.")
        console.error(error)
      }
    }, REFRESH_INTERVAL * 1000)
  }
})();