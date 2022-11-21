export function reorderList(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
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

export function makeElementDraggable(element, options = { horizontal: true, vertical: true, doneCallback: undefined }) {
    // The element assumed to have "position: absolute;"
    let posX = 0,
        posY = 0,
        prevPosX = 0,
        prevPosY = 0;
    element.addEventListener("mousedown", dragMouseDown);
    element.removeDraggable = function() {
        element.removeEventListener("mousedown", dragMouseDown);
    };

    function dragMouseDown(e) {
        if (e.button !== 0) return;
        e = e || window.event;
        e.preventDefault();
        prevPosX = e.clientX;
        prevPosY = e.clientY;
        document.addEventListener("mousemove", dragMouseMove);
        document.addEventListener("mouseup", dragMouseUp);
    }

    function dragMouseMove(e) {
        e = e || window.event;
        e.preventDefault();
        posX = prevPosX - e.clientX;
        posY = prevPosY - e.clientY;
        prevPosX = e.clientX;
        prevPosY = e.clientY;
        if (options?.vertical) element.style.top = element.offsetTop - posY + "px";
        if (options?.horizontal) element.style.left = element.offsetLeft - posX + "px";
    }

    function dragMouseUp() {
        if (options.doneCallback) options.doneCallback(element.offsetTop - posY, element.offsetLeft - posX);
        document.removeEventListener("mousemove", dragMouseMove);
        document.removeEventListener("mouseup", dragMouseUp);
    }
}
