export const keepImageInside = (position, container, box) => {
    if (!container || !box) return position;

    let { x, y, scale } = position;
    const containerRect = container.getBoundingClientRect(); 

    const maxScale = Math.min(
        containerRect.width / box.offsetWidth, 
        containerRect.height / box.offsetHeight
    );

    scale = Math.min(maxScale, scale);

    const scaledBoxWidth = box.offsetWidth * scale; 
    const scaledBoxHeight = box.offsetHeight * scale;


    // calculate the minimum and maximum values for x and y
    const minX = - (containerRect.width / 2) + (scaledBoxWidth / 2);
    const maxX = (containerRect.width / 2) - (scaledBoxWidth / 2);

    const minY = - ((scaledBoxHeight - box.offsetHeight) / 2) + (scaledBoxHeight - box.offsetHeight);
    const maxY = containerRect.height - scaledBoxHeight + ((scaledBoxHeight - box.offsetHeight) / 2);

    // Ensure the x and y values are within the allowed range
    x = Math.max(minX, Math.min(x, maxX)); 
    y = Math.max(minY, Math.min(y, maxY)); 

    return { x, y, scale };
};