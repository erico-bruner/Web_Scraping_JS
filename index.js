require('dotenv').config()

function verif_pon(pon) {
    if (pon > -28) {
        const r_pon = `Sinal dentro do PDQ ${pon}. `
        return r_pon
    }else{
        const r_pon = `Sinal fora do PDQ ${pon}. `
        return r_pon
    }
}

function verif_canal(canal) {
    if(canal == 1){
        const newcanal = 6
        return newcanal
    }
    if(canal == 6){
        const newcanal = 11
        return newcanal
    }
    if(canal == 11){
        const newcanal = 1
        return newcanal
    }
    if(canal != 1 & canal != 6 & canal != 11){
        const newcanal = 1
        return newcanal
    }
}

const {Builder, By, Key, until} = require('selenium-webdriver');
//const wifiConfig = require('./ZTE/wifiConfig/wifiConfig');

IP = process.env.IP
PON = "getpage.gch?pid=1002&nextpage=pon_status_link_info_t.gch"
WLAN = "getpage.gch?pid=1002&nextpage=net_wlanm_conf1_t.gch"
LAN = "getpage.gch?pid=1002&nextpage=net_dhcp_dynamic_t.gch"

async function example() {
    let driver = await new Builder(headless = false).forBrowser(process.env.BROWSER).build();
    driver.manage().window().maximize();

    await driver.get(`http://${IP}/`)

    await driver.findElement(By.name('Username')).sendKeys(process.env.USER)
    await driver.findElement(By.name('Password')).sendKeys(process.env.PASS)

    await driver.findElement(By.id('LoginId')).click()

    //====== PON ==============================================================

    await driver.get(`http://${IP}/`+PON)
    pon_status = await driver.findElement(By.id("Fnt_RxPower")).getText()
    const m_pon = "Acessado ZTE. "+verif_pon(pon_status)

     //====== WLAN ==============================================================

    await driver.get(`http://${IP}/`+WLAN)

    const canalstatus = await driver.executeScript('return document.getElementById("Frm_Channel").selectedIndex')

    const newcanal = verif_canal(canalstatus)

    await driver.executeScript(`document.getElementById("Frm_Channel").selectedIndex = ${newcanal}`)

    await driver.findElement(By.id('Btn_Submit')).click()
    
    const m_canal = `Alterado canal de ${canalstatus} para ${newcanal}. `

    //====== LAN ==============================================================

    await driver.get(`http://${IP}/`+LAN) 

    await driver.findElement(By.name('Frm_DNSServer1')).clear()
    await driver.findElement(By.name('Frm_DNSServer1')).sendKeys('8.8.8.8')

    await driver.findElement(By.name('Frm_DNSServer2')).clear()
    await driver.findElement(By.name('Frm_DNSServer2')).sendKeys('189.45.192.3')

    await driver.findElement(By.name('Frm_DNSServer3')).clear()
    await driver.findElement(By.name('Frm_DNSServer3')).sendKeys('177.200.200.20')

    const m_dns = "Fixado DNS. "

    await driver.findElement(By.id('Btn_Submit')).click()

    console.log("================================================================================")
    console.log(m_pon+m_canal+m_dns)
    console.log("================================================================================")
}

example()