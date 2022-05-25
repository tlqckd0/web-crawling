const cheerio = require('cheerio');

const crawler = ({ crawl_object, content }) => {
    const $ = cheerio.load(content);
    const result = [];
    $(crawl_object.select_path).each(function (idx, element) {
        const $data = cheerio.load(element);
        const return_data = {};
        crawl_object.items.forEach((item) => {
            if (item.text === true) {
                return_data[item.name] = $data(item.path).text();
            }

            if (item.href === true) {
                return_data[item.name] = $data(item.path).attr('href');
            }
        });

        if (crawl_object.type === 'post') {
            if (
                return_data.counter === 'AD' ||
                return_data.counter === '공지' ||
                return_data.counter === '번호'
            ) {
                //PASS
            } else {
                result.push(return_data);
            }
        }

        if (crawl_object.type === 'comment') {
            const comment_id = element.attribs.id.substring(4);
            const class_list = element.attribs.class.split(' ');
            return_data['id'] = comment_id;
            return_data['info'] = class_list;
            result.push(return_data);
        }
    });
    return result;
};

module.exports = {
    crawler,
};
