/*!
 * Quasar Framework v2.11.9
 * (c) 2015-present Razvan Stoenescu
 * Released under the MIT License.
 */
(function(e,t){"object"===typeof exports&&"undefined"!==typeof module?module.exports=t():"function"===typeof define&&define.amd?define(t):(e="undefined"!==typeof globalThis?globalThis:e||self,e.Quasar=e.Quasar||{},e.Quasar.lang=e.Quasar.lang||{},e.Quasar.lang.zhTW=t())})(this,function(){"use strict";var e={isoName:"zh-TW",nativeName:"中文（繁體）",label:{clear:"清除",ok:"確定",cancel:"取消",close:"關閉",set:"設定",select:"選擇",reset:"重置",remove:"移除",update:"更新",create:"新增",search:"搜尋",filter:"篩選",refresh:"更新",expand:e=>e?`展開"${e}"`:"擴張",collapse:e=>e?`折疊"${e}"`:"坍塌"},date:{days:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),daysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),headerTitle:e=>new Intl.DateTimeFormat("zh-TW",{weekday:"short",month:"short",day:"numeric"}).format(e),firstDayOfWeek:0,format24h:!1,pluralDay:"日"},table:{noData:"沒有資料",noResults:"沒有相符資料",loading:"載入中...",selectedRecords:e=>"已選擇 "+e+" 列",recordsPerPage:"每頁列數：",allRows:"全部",pagination:(e,t,a)=>e+"-"+t+" 列，共 "+a+" 列",columns:"欄位"},editor:{url:"網址",bold:"粗體",italic:"斜體",strikethrough:"刪除線",underline:"下劃線",unorderedList:"項目符號清單",orderedList:"編號清單",subscript:"下標",superscript:"上標",hyperlink:"超連結",toggleFullscreen:"切換全螢幕",quote:"段落引用",left:"靠左對齊",center:"置中對齊",right:"靠右對齊",justify:"分散對齊",print:"列印",outdent:"減少縮排",indent:"增加縮排",removeFormat:"清除格式",formatting:"區塊元素",fontSize:"字型大小",align:"對齊",hr:"水平分隔線",undo:"復原",redo:"取消復原",heading1:"標題 1",heading2:"標題 2",heading3:"標題 3",heading4:"標題 4",heading5:"標題 5",heading6:"標題 6",paragraph:"段落",code:"程式碼",size1:"非常小",size2:"稍小",size3:"正常",size4:"稍大",size5:"大",size6:"非常大",size7:"超級大",defaultFont:"預設字型",viewSource:"切換原始碼"},tree:{noNodes:"沒有節點",noResults:"沒有相符節點"}};return e});