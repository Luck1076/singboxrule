const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['日韩台新'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日|韩|台|新|hk|tw|jp|sg|asia|HongKong|TaiWan|Japan|singapore|港|hk|hongkong|Hong Kong|🇭🇰/i))
  }
  if (['单选节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['香港节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|Hong Kong|🇭🇰/i))
  }
  if (['台湾节点', '🇨🇳 台湾节点-自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (['日本节点', '🇯🇵 日本节点-自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (['新加坡节点', '🇸🇬 新加坡节点-自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
  }
  if (['美国节点', '🇺🇲 美国节点-自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
   if (['韩国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /韩/i))
  }
   if (['全部自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['lemon'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies,/vip/i))
  }

})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}