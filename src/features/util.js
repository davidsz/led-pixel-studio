export function reorderList(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export function convertInterval(value, from, to) {
    if (value < from[0]) value = from[0];
    if (value > from[1]) value = from[1];
    return to[0] + ((to[1] - to[0]) / (from[1] - from[0])) * (value - from[0]);
}

export function makeElementResizable(
    element,
    handleElement,
    options = { horizontal: true, vertical: true, doneCallback: undefined }
) {
    // The handleElement is assumed to be in fixed position inside the element
    let startX, startY, startWidth, startHeight;
    handleElement.addEventListener("mousedown", resizeMouseDown);

    function resizeMouseDown(e) {
        if (e.button !== 0) return;
        e = e || window.event;
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        document.addEventListener("mousemove", resizeMouseMove);
        document.addEventListener("mouseup", resizeMouseUp);
    }

    function resizeMouseMove(e) {
        e = e || window.event;
        e.preventDefault();
        if (options?.horizontal) element.style.width = `${startWidth + e.clientX - startX}px`;
        if (options?.vertical) element.style.height = `${startHeight + e.clientY - startY}px`;
    }

    function resizeMouseUp(e) {
        if (options.doneCallback) options.doneCallback(startWidth + e.clientX - startX, startHeight + e.clientY - startY);
        document.removeEventListener("mousemove", resizeMouseMove);
        document.removeEventListener("mouseup", resizeMouseUp);
    }
}

export function makeElementDraggable(
    element,
    options = { horizontal: true, vertical: true, grabbedCallback: undefined, doneCallback: undefined }
) {
    // The element assumed to have "position: absolute;"
    let posX = 0,
        posY = 0,
        prevPosX = 0,
        prevPosY = 0;
    element.addEventListener("mousedown", dragMouseDown);

    element.removeDraggable = function () {
        element.removeEventListener("mousedown", dragMouseDown);
    };

    // Initiate drag programmatically instead of clicking on the element
    element.initiateDrag = function (e, x, y) {
        if (options?.vertical) {
            prevPosY = e.clientY;
            element.style.top = y + "px";
        }
        if (options?.horizontal) {
            prevPosX = e.clientX;
            element.style.left = x + "px";
        }
        document.addEventListener("mousemove", dragMouseMove);
        document.addEventListener("mouseup", dragMouseUp);
        if (options.grabbedCallback) options.grabbedCallback(element.offsetTop - prevPosY, element.offsetLeft - prevPosX);
    };

    function dragMouseDown(e) {
        if (e.button !== 0) return;
        e = e || window.event;
        e.preventDefault();
        prevPosX = e.clientX;
        prevPosY = e.clientY;
        document.addEventListener("mousemove", dragMouseMove);
        document.addEventListener("mouseup", dragMouseUp);
        if (options.grabbedCallback) options.grabbedCallback(element.offsetTop - prevPosY, element.offsetLeft - prevPosX);
    }

    function dragMouseMove(e) {
        e = e || window.event;
        e.preventDefault();
        if (options?.vertical) {
            posY = prevPosY - e.clientY;
            prevPosY = e.clientY;
            element.style.top = element.offsetTop - posY + "px";
        }
        if (options?.horizontal) {
            posX = prevPosX - e.clientX;
            prevPosX = e.clientX;
            element.style.left = element.offsetLeft - posX + "px";
        }
    }

    function dragMouseUp() {
        let x = element.offsetLeft - posX;
        if (x < 0) {
            x = 0;
            element.style.left = "0px";
        }
        let y = element.offsetTop - posY;
        if (y < 0) {
            y = 0;
            element.style.top = "0px";
        }
        if (options.doneCallback) options.doneCallback(y, x);
        document.removeEventListener("mousemove", dragMouseMove);
        document.removeEventListener("mouseup", dragMouseUp);
    }
}
