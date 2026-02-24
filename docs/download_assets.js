const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const tools = [{"href":"/handwriting_erasure.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_PLIH-GtGXkL.png"},{"href":"/zitie_new.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_mfZWm5RYfb5.png"},{"href":"/relatives_name.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_5QJiaZbeCPA.png"},{"href":"/school.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_aI87pFy9qgC.png"},{"href":"/wordcount.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_RT-rk3FR-r3.png"},{"href":"/dynasties.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_M4UejcjNNLA.png"},{"href":"/capital.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_jdB6qNUoFvz.png"},{"href":"/jielong.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_ESsECZTMRls.png"},{"href":"/markmap.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_bQ-p2YBsK6u.png"},{"href":"/hanzifayin.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_JTXa_lLHuPQ.png"},{"href":"/periodic.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_zmxsNOQj-Ex.png"},{"href":"/translate.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_evABSEpv1y-.png"},{"href":"/radical.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_BAMJebHHnfG.png"},{"href":"/allegory.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_LgMaUNruKSv.png"},{"href":"/explain.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_0LtgddfOhwt.png"},{"href":"/chengyujielong.html","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_info/b91aa2df_UVpYlcJGb3t.png"}];

const categories = [{"text":"全部","href":"/","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_hdtg75yhyui.png"},{"text":"图片工具","href":"/category/img","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_2a8nx3hj8yp.png"},{"text":"PDF转换工具","href":"/category/pdf","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_1644201mmws.png"},{"text":"数据换算工具","href":"/category/data","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_nblqv4ia9z4.png"},{"text":"生活娱乐工具","href":"/category/life","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_ds3wkxdvuua.png"},{"text":"教育工具","href":"/category/education","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_y0lbjzlu59p.png"},{"text":"文本工具","href":"/category/text","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_je2677qg5fb.png"},{"text":"文档转换工具","href":"/category/doc","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_o6yx66wdmgs.png"},{"text":"开发工具","href":"/category/develop","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_xv4ans9q0zn.png"},{"text":"视频工具","href":"/category/video","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/20230406_yu36rbd9a5q.png"},{"text":"浏览器插件","href":"/category/pc_plugin","imgSrc":"https://m4.publicimg.browser.qq.com/imgUpload/qbtool.t_tool_type/81ddfdd4_M1DGARwp9eH.png"}];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    if (!url) return resolve();
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

(async () => {
  for (const t of tools) {
    if (t.imgSrc) {
      const filename = path.basename(t.href).replace('.html', '.png');
      await download(t.imgSrc, path.join(__dirname, '..', 'assets', filename));
    }
  }
  for (const c of categories) {
    if (c.imgSrc) {
      const filename = `cat_${c.href.replace(/\//g, '_')}.png`.replace('cat__.png', 'cat_all.png');
      await download(c.imgSrc, path.join(__dirname, '..', 'assets', filename));
    }
  }
  console.log('Images downloaded');
})();
