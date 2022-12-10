export var CanvasToBMP = {
    toArrayBuffer: function (canvas) {
        var w = canvas.width,
            h = canvas.height,
            w3 = w * 3,
            idata = canvas.getContext("2d").getImageData(0, 0, w, h),
            data32 = new Uint32Array(idata.data.buffer), // 32-bit representation of canvas
            extraBytes = w % 4,
            stride = w3 + extraBytes,
            pixelArraySize = stride * h,
            fileLength = 54 + pixelArraySize, // header size is known + bitmap
            file = new ArrayBuffer(fileLength), // raw byte buffer (returned)
            view = new DataView(file), // handle endian, reg. width etc.
            pos = 0,
            p,
            s = 0,
            v;

        // write file header
        setU16(0x4d42); // BM
        setU32(fileLength); // total length
        pos += 4; // skip unused fields
        setU32(0x36); // offset to pixel data

        // DIB header
        setU32(40); // header size
        setU32(w);
        setU32(h);
        setU16(1); // 1 plane
        setU16(24); // 24-bits (RGB)
        setU32(0); // no compression (BI_BITFIELDS, 0)
        setU32(0); // pixel array size, valid to set 0 if compression == 0
        setU32(2835); // pixels/meter h (~72 DPI x 39.3701 inch/m)
        setU32(2835); // pixels/meter v
        pos += 8; // skip color/important colors

        // bitmap data
        for (let y = h - 1; y >= 0; y--) {
            p = 0x36 + y * stride; // pixel pos = offset + row * stride
            for (let x = 0; x < w3; ) {
                v = data32[s++]; // get ABGR, remove alpha
                view.setUint8(p + x, v >>> 16); // B
                x++;
                view.setUint8(p + x, v >>> 8); // G
                x++;
                view.setUint8(p + x, v); // R
                x++;
            }
        }

        return file;

        // helper method to move current buffer position
        function setU16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }
        function setU32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    },

    toBlob: function (canvas) {
        return new Blob([this.toArrayBuffer(canvas)], {
            type: "image/bmp",
        });
    },

    toDataURL: function (canvas) {
        var buffer = new Uint8Array(this.toArrayBuffer(canvas)),
            bs = "",
            i = 0,
            l = buffer.length;
        while (i < l) bs += String.fromCharCode(buffer[i++]);
        return "data:image/bmp;base64," + btoa(bs);
    },
};
