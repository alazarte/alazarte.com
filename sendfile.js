function uploadFile(secret, file, isPrivate) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("secret", secret);
    formData.append("isPrivate", isPrivate);

    fetch("https://api.alazarte.com/file", {method: "POST", body: formData})
        .then(r => {
            appendStatus(r.status, r.statusText);
            console.log(r);
            console.log(r.ok);

            if (! r.ok) {
                return;
            }

            r.text()
                .then( t => {
                    appendLink(t);
                });
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
            console.log(r.ok);

            if (! r.ok) {
                return;
            }

            r.text()
                .then( t => {
                    appendLink(t);
                });
        });
}

function appendStatus(status, statusText) {
    const statusElem = document.getElementById("status");
    const st = document.createElement("div");
    st.innerHTML = status + " " + statusText;

    statusElem.appendChild(st);
}

function appendLink(link) {
    let al = undefined;
    if (link === "Private file saved") {
        al = document.createElement("p");
    } else {
        al = document.createElement("a");
        al.setAttribute("href", link);
    }

    const brElem = document.createElement("br");
    const linksElem = document.getElementById("links");
    al.innerHTML = link;

    console.log(link);

    linksElem.appendChild(al);
    linksElem.appendChild(brElem);
}

function sendFile() {
    const statusElem = document.getElementById("status");
    statusElem.innerHTML = "Wait a bit, server has slow connection";

    const file = document.getElementById("file").files[0];
    const paste = document.getElementById("paste").value;
    const secret = document.getElementById("secret").value;
    const isPrivate = document.getElementById("isPrivate").checked;
    const title = document.getElementById("title").value;


    const linksElem = document.getElementById("links");
    linksElem.innerHTML = "";

    if ((file && title) || paste) {
        if (file) {
            uploadFile(secret, file, isPrivate);
        }

        if (title && paste) {
            uploadPaste(secret, title, paste, isPrivate);
        }

        return;
    }

    statusElem.innerHTML = "Nothing to send.";
    return;
}
