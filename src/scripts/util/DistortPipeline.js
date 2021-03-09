const DistortPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline,

    initialize:

    function DistortPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;
            uniform float     time;
            uniform vec2      resolution;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            void main( void ) {
                vec2 uv = outTexCoord;
                //uv.y *= -1.0;
                uv.y += (sin((uv.x + (time * 0.5)) * 10.0) * 0.1) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);
                vec4 texColor = texture2D(uMainSampler, uv);
                gl_FragColor = texColor;
            }`
        });
    } 

});

export default DistortPipeline;