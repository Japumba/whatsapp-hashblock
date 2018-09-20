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

    AddDocumentListeners();
});

function AddDocumentListeners() {
    $(document).ready(function () {
        var targetNode = document.getElementById('app');
        var config = { attributes: true, childList: true, subtree: true };

        var callback = function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    if (mutation.addedNodes) {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i]
                            if (node.nodeType == Node.ELEMENT_NODE && node.tagName == "DIV") {
                                markSpoilers(node);
                            }
                        }
                    }
                }
            }
        };

        var observer = new MutationObserver(callback);

        observer.observe(targetNode, config);
    });
}

function markSpoilers(node) {
    for (const hashtag of globalSettings.hashtags) {
        if (node.children.length == 0 && node.textContent.toLowerCase().includes(hashtag)) {
            console.log(`${hashtag} found.`);

            $(node.parentElement.parentElement.parentElement).addClass("spoiler");
        }
    }

    for (var i = 0; i < node.children.length; i++) {
        markSpoilers(node.children[i])
    }

    return;
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