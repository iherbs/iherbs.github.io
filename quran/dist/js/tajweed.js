var arabicmatcher = /[؀-ٟ٪-ۯۺ-ۿ]+/;

var gunnahmatcher = /([ن|م]ّ|مِمَّ)/g; //
var qalqalamatcher = /([قطبجد](ْ|ۡ|[^ه]?[^هىا]?[^هىا]$))/g; //
var iqlabmmatcher = /([ۭۢ][ْۡاى]?[ۛۚۗۖۙۘ]? ?ب)/g; //
var idhghammatcher = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? [نميو]ّ)/g; //
var idhghammatcherwihtoutgunnah = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? [رل])/g; //
var idhghammimimatcher = /([م][ْۛۚۗۖۙۘۡ]? م)/g; //
var ikhfamatcher = /([نًٌٍ][ْۡاى]?[ۛۚۗۖۙۘ]? ?[صذثكجشقسدطزفتضظک])/g; //
var ikhfasyamatcher = /([م][ْۡ]? ?ب)/g; //
var madda = /(وْ|يْ)/g;
var hamzawaslmatcher = /([ن|م]ّ)/g; //

function parseArabic(text, show = "true") {

    text = text.replaceAll('\u06d6', '\u06d6 &zwj;'); // ۖ
    text = text.replaceAll('\u06d7', '\u06d7 &zwj;'); // ۗ
    text = text.replaceAll('\u06da', '\u06da &zwj;'); // ۚ

    if (show == "true") {
        // &zwj;
        // console.log(text);
        // text = text.replace(gunnahmatcher, (text.substr((text.indexOf('$&') + 1), 2) == "ال" ? '&zwj;' : '') + '<tajweed class="gunnah">$&</tajweed>');
        text = text.replace(gunnahmatcher, '<tajweed class="gunnah">$&</tajweed>');
        text = text.replace(qalqalamatcher, '<tajweed class="qalqala">$&</tajweed>');
        text = text.replace(iqlabmmatcher, '<tajweed class="iqlab">$&</tajweed>');
        text = text.replace(idhghammatcher, '<tajweed class="idhgham">$&</tajweed>');
        text = text.replace(idhghammatcherwihtoutgunnah, '<tajweed class="idhghamnoghunnah">$&</tajweed>');
        text = text.replace(ikhfamatcher, '<tajweed class="ikhfa">$&</tajweed>');
        text = text.replace(ikhfasyamatcher, '<tajweed class="ikhfasya">$&</tajweed>');
        text = text.replace(idhghammimimatcher, '<tajweed class="idhghammimi">$&</tajweed>');
        text = text.replace(madda, '<tajweed class="madda">$&</tajweed>');
        // text = text.replace(hamzawaslmatcher, '<tajweed class="ham_wasl">$&</tajweed>');
    }
    text = text.replaceAll('\u06dE', '<span class="smark">\u06dE</span>');
    return text;
}