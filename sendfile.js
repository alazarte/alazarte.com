function request(url, body, msgPrefix) {
    let rs = {};
    return fetch(url, {method: "POST", body: body})
        .then(r => {
            rs.status = r.status;
            rs.statusText = r.statusText;
            return r.text();
        })
        .then(r => {
            rs.link = r;
            return rs;
        })
        .catch(e => {
            console.log(e);
            return e;
        });
}

function uploadFile(secret, file, isPrivate) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("secret", secret);
    formData.append("isPrivate", isPrivate);

    fetch("https://api.alazarte.com/file", {method: "POST", body: formData})
        .then(r => {
            appendStatus(r.status, r.statusText);

            if (r.status < 200 && r.status > 299) {
                return;
            }

            appendLink(r.link);
        })
        .catch( e => {
            console.log(e);
            appendStatus(0, e);
        });
}

function uploadPaste(secret, title, paste, isPrivate) {
    const formData = new FormData();

    formData.append("secret", secret);
    formData.append("title", title);
    formData.append("paste", paste);
    formData.append("isPrivate", isPrivate);

    fetch("https://api.alazarte.com/paste", {method: "POST", body: formData})
        .then( r => {
            appendStatus(r.status, r.statusText);
            console.log(r);
            if (r.status < 200 && r.status > 299) {
                return;
            }

            appendLink(r.link);
        });
}

function appendStatus(status, statusText) {
    const statusElem = document.getElementById("status");
    const st = document.createElement("div");
    st.innerHTML = status + " " + statusText;

    statusElem.appendChild(st);
}

function appendLink(link) {
    const brElem = document.createElement("br");
    const linksElem = document.getElementById("links");
    const al = document.createElement("a");
    al.setAttribute("href", link);
    al.innerHTML = link;

    console.log(link);

    linksElem.appendChild(al);
    linksElem.appendChild(brElem);
}

function sendFile() {
    const statusElem = document.getElementById("status");
    statusElem.innerHTML = "Wait a bit, server has slow connection";

    const brElem = document.createElement("br");

    const file = document.getElementById("file").files[0];
    const paste = document.getElementById("paste").value;
    const secret = document.getElementById("secret").value;
    const isPrivate = document.getElementById("isPrivate").checked;
    const title = document.getElementById("title").value;


    const linksElem = document.getElementById("links");
    linksElem.innerHTML = "";

    if (! file && !title && !paste) {
        statusElem.innerHTML = "Nothing to send.";
        return;
    }

    if (file) {
        uploadFile(secret, file, isPrivate);
    }

    if (title && paste) {
        uploadPaste(secret, title, paste);
    }

}
