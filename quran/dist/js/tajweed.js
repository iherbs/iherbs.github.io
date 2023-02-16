meta = [
    {
        'identifier': '[h',
        'type': 'hamza-wasl',
        'description': 'Hamzat ul Wasl',
        'default_css_class': 'ham_wasl',
        'html_color': '#AAAAAA'
    },
    {
        'identifier': '[s',
        'type': 'silent',
        'description': 'Silent',
        'default_css_class': 'slnt',
        'html_color': '#AAAAAA'
    },
    {
        'identifier': '[l',
        'type': 'laam-shamsiyah',
        'description': 'Lam Shamsiyyah',
        'default_css_class': 'slnt',
        'html_color': '#AAAAAA'
    },
    {
        'identifier': '[n',
        'type': 'madda-normal',
        'description': 'Normal Prolongation: 2 Vowels',
        'default_css_class': 'madda_normal',
        'html_color': '#537FFF'
    },
    {
        'identifier': '[p',
        'type': 'madda-permissible',
        'description': 'Permissible Prolongation: 2, 4, 6 Vowels',
        'default_css_class': 'madda_permissible',
        'html_color': '#4050FF'
    },
    {
        'identifier': '[m',
        'type': 'madda-necesssary',
        'description': 'Necessary Prolongation: 6 Vowels',
        'default_css_class': 'madda_necessary',
        'html_color': '#000EBC'
    },
    {
        'identifier': '[q',
        'type': 'qalaqah',
        'description': 'Qalaqah',
        'default_css_class': 'qlq',
        'html_color': '#DD0008'
    },
    {
        'identifier': '[o',
        'type': 'madda-obligatory',
        'description': 'Obligatory Prolongation: 4-5 Vowels',
        'default_css_class': 'madda_pbligatory',
        'html_color': '#2144C1'
    },
    {
        'identifier': '[c',
        'type': 'ikhafa-shafawi',
        'description': 'Ikhafa\' Shafawi - With Meem',
        'default_css_class': 'ikhf_shfw',
        'html_color': '#D500B7'
    },
    {
        'identifier': '[f',
        'type': 'ikhafa',
        'description': 'Ikhafa\'',
        'default_css_class': 'ikhf',
        'html_color': '#9400A8'
    },
    {
        'identifier': '[w',
        'type': 'idgham-shafawi',
        'description': 'Idgham Shafawi - With Meem',
        'default_css_class': 'idghm_shfw',
        'html_color': '#58B800'
    },
    {
        'identifier': '[i',
        'type': 'iqlab',
        'description': 'Iqlab',
        'default_css_class': 'iqlb',
        'html_color': '#26BFFD'
    },
    {
        'identifier': '[a',
        'type': 'idgham-without-ghunnah',
        'description': 'Idgham - With Ghunnah',
        'default_css_class': 'idgh_ghn',
        'html_color': '#169200'
    },
    {
        'identifier': '[u',
        'type': 'idgham-without-ghunnah',
        'description': 'Idgham - Without Ghunnah',
        'default_css_class': 'idgh_w_ghn',
        'html_color': '#169200'
    },
    {
        'identifier': '[d',
        'type': 'idgham-mutajanisayn',
        'description': 'Idgham - Mutajanisayn',
        'default_css_class': 'idgh_mus',
        'html_color': '#A1A1A1'
    },
    {
        'identifier': '[b',
        'type': 'idgham-mutaqaribayn',
        'description': 'Idgham - Mutaqaribayn',
        'default_css_class': 'idgh_mus',
        'html_color': '#A1A1A1'
    },
    {
        'identifier': '[g',
        'type': 'ghunnah',
        'description': 'Ghunnah: 2 Vowels',
        'default_css_class': 'ghn',
        'html_color': '#FF7E1E'
    }
];

function parseArabic(text, show = "true", fixWebkit = true) {
    if (fixWebkit) {
        return this.webkitFix(this.closeParsing(this.parseTajweed(text, show)));
    }

    return this.closeParsing(this.parseTajweed(text));
}

function parseTajweed(text, show = "true") {
    this.meta.forEach((meta) => {
        let _re = new RegExp("(\\" + meta.identifier + ")", "ig");
        text = text.replace(_re, `<tajweed class="${show == "true" ? meta.default_css_class : ''}" data-type="${meta.type}" data-description="${meta.description}" data-tajweed="`)
    })

    return text;
}

function webkitFix(text) {
    // Identify Tajweed tags, if there is not a space before or after, add &zwj;
    // After
    text = text.replace('/<\/tajweed>(\S)/', '&zwj;${0}')
    // Before
    text = text.replace('/(\S)<tajweed class="(.*?)" data-type="(.*?)" data-description="(.*?)" data-tajweed="(.*?)">(\S)/', '${1}<tajweed class="${2}" data-type="${3}" data-description="${4}" data-tajweed="${5}">&zwj;&zwj;${6}')

    // Let's remove all joiners where not needed for an Alif and a Waw
    text = text.replace(['ٱ&zwj;'], ['ٱ']);

    return text;
}

function closeParsing(text) {
    let re_1 = new RegExp("(\\[)", "ig");
    text = text.replace(re_1, '">');
    let re_2 = new RegExp("(\\])", "ig");
    text = text.replace(re_2, '</tajweed>');

    return text;
}