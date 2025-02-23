export const keepImageInside = (position, container, box) => {
    if (!container || !box) return position;

    const containerRect = container.getBoundingClientRect();
    const boxWidth = box.offsetWidth * position.scale;
    const boxHeight = box.offsetHeight * position.scale;

    let { x, y, scale } = position;

    // Calculate the minimum and maximum values for x and y
    const minX = 0 - (containerRect.width / 2) + (boxWidth / 2);
    const maxX = (containerRect.width / 2) - (boxWidth / 2);

    const minY =0;
    const maxY =  containerRect.height - boxHeight;

    // Ensure x and y are within the valid range
    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    return { x, y, scale };
};
