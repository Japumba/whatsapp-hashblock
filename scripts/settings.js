const version = "1";
let globalSettings;

getSettings((settings) => {
    globalSettings = settings;
    if (globalSettings === undefined || globalSettings.version != version) {
        console.log("No settings found. Generating Defaults...");
        globalSettings = {
            version: version,
            hashtags: [
                "#spoiler",
                "#nsfw"
            ]
        }
        saveSettings(globalSettings, () => {
            console.log("Default Settings generated");
        });
    }
    $(document).ready(function () {
        document.getElementById("btnAddHashtag").onclick = addHashtag;
        refreshSettings();
    });
});

function refreshSettings() {
    let hashtagListNode = document.getElementById("hashtags");

    while (hashtagListNode.firstChild) {
        hashtagListNode.removeChild(hashtagListNode.firstChild);
    }

    for (const hashtag of globalSettings.hashtags) {
        let node = document.createElement("li");
        node.classList.add("list-group-item", "px-2", "py-2", "d-flex", "justify-content-between", "align-items-center");

        let hashtagNode = document.createElement("span");
        hashtagNode.innerText = hashtag;
        hashtagNode.classList.add("float-left");
        node.appendChild(hashtagNode);

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("btn", "fas", "fa-minus-circle", "float-right", "text-danger", "px-0");
        deleteIcon.onclick = () => { removeHashtag(hashtag); }

        node.appendChild(deleteIcon);
        hashtagListNode.appendChild(node);
    }
}

function removeHashtag(hashtag) {
    console.log("Remove hashtag:", hashtag);
    globalSettings.hashtags = globalSettings.hashtags.filter(e => e != hashtag);

    saveSettings(globalSettings, () => {
        console.log("Saved Settings");
        refreshSettings();
    });
}

function addHashtag() {
    let hashtag = document.getElementById("hashtagInput").value;

    if(!hashtag.startsWith("#")) {
        hashtag = "#" + hashtag;
    }

    if (!globalSettings.hashtags.indexOf(hashtag) >= 0) {
        globalSettings.hashtags.push(hashtag);
        saveSettings(globalSettings, () => {
            console.log("Saved Settings");
            refreshSettings();
        });
    }
}

function getSettings(callback) {
    chrome.storage.sync.get(callback);
}

function saveSettings(settings, callback) {
    chrome.storage.sync.set(settings, (callback));
}

function clearSettings() {
    chrome.storage.sync.clear();
}