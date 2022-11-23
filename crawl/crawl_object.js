const get_post_object = () => {
    return {
        href: '/list/animation',
        select_path: '#content-wrap > div > div.board-list > ul > li',
        items: [
            { name: 'counter', path: 'span.count', text: true, href: false },
            { name: 'href', path: 'span.title > a', text: false, href: true },
            { name: 'title', path: 'span.title > a', text: true, href: false },
            { name: 'nick', path: 'span.global-nick', text: true, href: false },
            { name: 'date', path: 'span.date', text: true, href: false },
        ],
        type: 'post',
    }
};

const get_comment_object = () => {
    return {
        href: '',
        select_path: 'div.comment-item',
        items: [
            {
                name: 'nick',
                path: 'span.global-nick.nick > a',
                text: true,
                href: false,
            },
            { name: 'date', path: 'div > span.date-line', text: true, href: false },
        ],
        type: 'comment',
    };
};

const post_list_object = {
    href: '/list/animation',
    select_path: '#content-wrap > div > div.board-list > ul > li',
    items: [
        { name: 'counter', path: 'span.count', text: true, href: false },
        { name: 'href', path: 'span.title > a', text: false, href: true },
        { name: 'title', path: 'span.title > a', text: true, href: false },
        { name: 'nick', path: 'span.global-nick', text: true, href: false },
        { name: 'date', path: 'span.date', text: true, href: false },
    ],
    type: 'post',
};

const comment_list_object = {
    href: '',
    select_path: 'div.comment-item',
    items: [
        {
            name: 'nick',
            path: 'span.global-nick.nick > a',
            text: true,
            href: false,
        },
        { name: 'date', path: 'div > span.date-line', text: true, href: false },
    ],
    type: 'comment',
};

module.exports = {
    get_post_object,
    get_comment_object,
    post_list_object,
    comment_list_object,
};
