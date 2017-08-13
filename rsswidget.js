function listEntries(json) {

  // Clear any information displayed under the "data" div.
  removeOldResults();
  var ul = document.createElement('ul');
  var feedlen = json.feed.entry.length;
  var parser = new DOMParser();  

  for (var i = 0; i < (feedlen <= 3 ? feedlen : 3); i++) {    
    var entry = json.feed.entry[i];
    var content = json.feed.entry[i].content.$t;
    var dum = "<html><head><title>titleTest</title></head><body>" + content + "</body></html>";
    var post = parser.parseFromString(dum, "text/html");
    var img = post.getElementsByTagName('img').item(0);
    var alturl;
    var imgurl;
    var imgre = /https?:\/\/.+?\.(jpg|gif|png)/gi;
    var meta = (function () {
        var m = post.querySelectorAll("meta"), r = {};
        for (var i = 0; i < m.length; i += 1) {
            r[m[i].getAttribute("name")] = m[i].getAttribute("content")
        }
        return r.reverse();
    })();

    for (var k = 0; k < entry.link.length; k++) {
      if (entry.link[k].rel == 'alternate') {
        alturl = entry.link[k].href;
        break;
      }      
    }
    
    //create post list
    var li = document.createElement('li');

    //create title item
    var a = document.createElement('a');
    a.href=alturl
    a.target = '_blank';
    a.className = 'blogger-title';
    var txt = document.createTextNode(entry.title.$t);    
    a.appendChild(txt);
    li.appendChild(a);

    //create header image item
    var imga = document.createElement('a');
    imga.href=alturl
    imga.target = '_blank';
    li.appendChild(imga);
    imga.appendChild(img);

    //if image attribution is found, add it
    if (meta.attribution) {
      var attribution = document.createElement('a');
      attribution.href = meta.attribution;
      attribution.target = '_blank';
      attribution.className = 'blogger-attribution';
      var domains = attribution.hostname.split('.');
      attribution.innerHTML = 'Image: ' + domains[0];
      li.appendChild(attribution);
    }
    
    //if post description is found, add it
    if (meta.description) {
      var pa = document.createElement('a');
      var p = document.createElement('p')
      p.innerHTML = meta.description;
      pa.href=alturl
      pa.target = '_blank';
      li.appendChild(pa)
      pa.appendChild(p)
    }
    
    ul.appendChild(li);
  }

  var lli = document.createElement('li');
  var lla = document.createElement('a');
  var span = document.createElement('span');
  var i = document.createElement('i');
  i.className = "fa fa-github";
  lla.href = "https://github.com/thebrianyork/BloggerRSSWidget";
  lla.target = '_blank';
  lla.className = 'blogger-code';
  var txt = document.createTextNode('Get this widget');  
  lla.appendChild(i);  
  lla.appendChild(span);
  span.appendChild(txt);
  lli.appendChild(lla);
  ul.appendChild(lli);
  document.getElementById('blogger-data').appendChild(ul);

}

function search(query) {
  removeOldJSONScriptNodes();

  removeOldResults();

  // Show a "Loading..." indicator.
  var div = document.getElementById('blogger-data');
  var p = document.createElement('p');
  p.appendChild(document.createTextNode('Loading...'));
  div.appendChild(p);

  // Retrieve the JSON feed.
  var script = document.createElement('script');
  script.setAttribute('src', 'https://' + query + '.blogspot.com/feeds/posts' +
                      '/default?alt=json-in-script&callback=listEntries');
  script.setAttribute('id', 'jsonScript');
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);
}

/**
 * Deletes any old script elements which have been created by previous calls
 * to search().
 */
function removeOldJSONScriptNodes() {
  var jsonScript = document.getElementById('jsonScript');
  if (jsonScript) {
    jsonScript.parentNode.removeChild(jsonScript);
  }
}

/**
 * Deletes pre-existing children of the data div from the page. The data div 
 * may contain a "Loading..." message, or the results of a previous query. 
 * This old data should be removed before displaying new data.
 */
function removeOldResults() {
  var div = document.getElementById('blogger-data');
  if (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

search('afullspectrum');
