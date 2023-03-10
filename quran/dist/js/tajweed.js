var arabicmatcher = /[؀-ٟ٪-ۯۺ-ۿ]+/;

var ghunnahmatcher = /([ن|م]ّ|مِمَّ)/g; //
var qalqalamatcher = /([قطبجد](ْ|ۡ|[^ه]?[^هىا]?[^هىا]$))/g; //
var iqlabmmatcher = /([ۭۢ][ْۡاى]?[ۛۚۗۖۙۘ]? ?ب)/g; //
var idhghammatcher = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? [نميو]ّ)/g; //
var idhghammatcherwihtoutghunnah = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? [رل])/g; //
var idhghammimimatcher = /([م][ْۛۚۗۖۙۘۡ]? م)/g; //
var ikhfamatcher = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? ?[صذثكجشقسدطزفتضظک])/g; //
var ikhfasyamatcher = /([م][ْۡ]? ?ب)/g; //
var madda = /(وْ|يْ)/g;
var hamzawaslmatcher = /([ن|م]ّ)/g; //

function parseArabic(text, show = "true") {

    text = text.trim();
    text = text.replaceAll('\u06d6', '\u06d6 \u200D'); // ۖ
    text = text.replaceAll('\u06d7', '\u06d7 \u200D'); // ۗ
    text = text.replaceAll('\u06da', '\u06da \u200D'); // ۚ

    if (show == "true") {
        // &zwj == \u200D;
        // console.log(text);
        // text = text.replace(ghunnahmatcher, (text.substr((text.indexOf('$&') + 1), 2) == "ال" ? '&zwj;' : '') + '<tajweed class="ghunnah">$&</tajweed>');
        text = text.replace(ghunnahmatcher, '<tajweed class="ghunnah">$&</tajweed>');
        text = text.replace(qalqalamatcher, '<tajweed class="qalqala">$&</tajweed>');
        text = text.replace(iqlabmmatcher, '<tajweed class="iqlab">$&</tajweed>');
        text = text.replace(idhghammatcher, '<tajweed class="idhgham">$&</tajweed>');
        text = text.replace(idhghammatcherwihtoutghunnah, '<tajweed class="idhghamnoghunnah">$&</tajweed>');
        // text = text.replace(ikhfamatcher, '<tajweed class="ikhfa">$&</tajweed>');
        text = text.replace(ikhfamatcher, function (match, capture) {
            return '<tajweed class="ikhfa">' + match.replace(' ', '</tajweed> <tajweed class="ikhfa">') + '</tajweed>';
        });
        text = text.replace(ikhfasyamatcher, '<tajweed class="ikhfasya">$&</tajweed>');
        text = text.replace(idhghammimimatcher, '<tajweed class="idhghammimi">$&</tajweed>');
        text = text.replace(madda, '<tajweed class="madda">$&</tajweed>');
        // text = text.replace(hamzawaslmatcher, '<tajweed class="ham_wasl">$&</tajweed>');
    }
    text = text.replaceAll('\u06dE', '<span class="smark">\u06dE</span>');
    text = text.replace(/^\u200D+|\u200D+$/gm, '');
    return text;
}