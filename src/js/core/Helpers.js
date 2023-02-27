/**
 *  Helper/utils functions
 *
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
//---------------------------------------------PRODUCT/SOFTWARE VERSION----------------------------------//
export function createVersionObject(devName, devID, rev) {
  return {
    prod: "De.Tec.Tor. srl",
    rel: "v1.0.0",
    date: "03/2022",
    product: devName,
    manual: "QCM" + devID + "-R&D-UM-" + rev,
  };
}
//Conversion-safe cast to boolean
export function toBool(data) {
  if (
    data == "1" ||
    data == 1 ||
    data == "True" ||
    data == "true" ||
    data == true ||
    data == "on"
  ) {
    return true;
  } else {
    return false;
  }
}
//Count days in month
export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
//Evaluate time difference between two date objects
export function getDeltaDate(date1, date2) {
  let hours1 = date1.getHours();
  let minutes1 = date1.getMinutes();
  let seconds1 = date1.getSeconds();
  let hours2 = date2.getHours();
  let minutes2 = date2.getMinutes();
  let seconds2 = date2.getSeconds();
  let deltaHours = (hours2 - hours1) * 3600;
  let deltaMinutes = (minutes2 - minutes1) * 60;
  let deltaSeconds = seconds2 - seconds1;
  let deltaTime = deltaHours + deltaMinutes + deltaSeconds;
  return deltaTime;
}
//Format integers in two digits numbers
export function twoDigits(number) {
  return number >= 10 ? number.toString() : "0" + number.toString();
}
//Format date to filename
export function formatDate(date) {
  return (
    date.getFullYear().toString() +
    twoDigits(date.getMonth() + 1) +
    twoDigits(date.getDate()) +
    "_" +
    twoDigits(date.getHours()) +
    twoDigits(date.getMinutes()) +
    twoDigits(date.getSeconds())
  );
}
export function getScript(url) {
  e = document.createElement("script");
  e.src = url;
  e.type = "application/javascript";
  document.body.appendChild(e);
}
//Numeric input custom validation
export function validateNumInput(id) {
  return parseFloat($(id).val().replace(/\s/g, "").replace(",", "."));
}
//Initialization of new page detector-customized style
export function initPageStyle(favicon, style) {
  let favicon_el = document.getElementById("favicon");
  favicon_el.href = favicon; //To be defined in the Controller
  // // Get HTML head element
  // let head = document.getElementsByTagName("HEAD")[0];
  // // Create new link Element
  // let link = document.createElement("link");
  // // set the attributes for link element
  // link.rel = "stylesheet";
  // link.type = "text/css";
  // link.href = style; //To be defined in the Controller
  // // Append link element to HTML head
  // head.appendChild(link);
}
//clear content of HTML container (div)
export function clearDiv(elementID) {
  let div = document.getElementById(elementID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}
//calculate sum of array elements
export function array_sum(array) {
  let sum = 0;
  array.forEach((element) => {
    sum += element;
  });
  return sum;
}
//calculate mean of array elements
export function array_mean(array) {
  let mean = 0;
  let count = 0;
  array.forEach((element) => {
    mean += element;
    count++;
  });
  return mean / count;
}
//reorder run list
export function sortRuns(array) {
  array.sort((a, b) => {
    let fa = a.name.toLowerCase();
    let fb = b.name.toLowerCase();
    if (fa < fb) {
      return 1;
    }
    if (fa > fb) {
      return -1;
    }
    return 0;
  });
  return array;
}
//check text overflow
export function isOverflown(clientHeight, scrollHeight) {
  scrollHeight > clientHeight;
}
//resize text in box
export function resizeText(
  element,
  elements,
  minSize = 8,
  maxSize = 12,
  step = 1,
  unit = "px"
) {
  if (elements) {
    (elements || [element]).forEach((el) => {
      let i = minSize;
      let overflow = false;
      const parent = el.parentNode;
      while (!overflow && i < maxSize) {
        el.style.fontSize = `${i}${unit}`;
        overflow = isOverflown(parent);
        if (!overflow) i += step;
      }
      // revert to last state where no overflow happened
      el.style.fontSize = `${i - step}${unit}`;
    });
  }
}
//split long words to fit box
export function splitLongWords(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }
  return chunks;
}
//remove all occurrences of VALUE from the array ARR
const removeAllFromArray = (arr, value) => {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};
//treat text to remove unrecognized symbols
export function treatNotes(notes) {
  //adapt the notes text to the modal space by chuncking long strings
  let charN = 36;
  let splitNotes = notes.split("\n");
  let newNotes = [];
  let mod_line = [];
  let temp_chunks = [];
  let wil = [];
  splitNotes.forEach((line) => {
    wil = line.split(" ");
    mod_line = [];
    wil.forEach((word) => {
      if (word.length > charN) {
        temp_chunks = splitLongWords(word, charN);
        mod_line.push(temp_chunks.join(" "));
      } else {
        mod_line.push(word);
      }
    });
    newNotes.push(mod_line.join(" "));
  });
  newNotes = removeAllFromArray(newNotes, "");
  let correctedNotes = newNotes.join("\n");
  return correctedNotes;
}
