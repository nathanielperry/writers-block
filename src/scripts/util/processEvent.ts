export default async function processEvent(scene, name) {
    const mom = scene.mom;

    switch (name) {
        case 'tutorial-1':
            //Show jump key
            scene.mom.forEachByName('key-up', key => key.setAlpha(1));
            collideWithPlayer('end-wall');
            collideWithPlayer('leaps-wall');
            collideWithPlayer('void-wall');
            collideWithPlayer('desert-wall');
            collideWithPlayer('discipline-wall');
            break;

        case 'tutorial-2':
            //Center camera on typewriter
            scene.cam.move(500);
            //Show grab key
            mom.forEachByName('key-down', key => key.setAlpha(1));
            break;

        case 'typewriter-get':
            //Show keyboard
            mom.forEachByName('keyboard', kb => kb.setAlpha(1));
            //Hide down key
            mom.forEachByName('key-down', key => key.setAlpha(0));
            break;

        case 'title-done':
            //Hide keyboard
            mom.forEachByName('keyboard', kb => kb.setAlpha(0));
            //Reset follow
            scene.cam.follow(scene.writer);
            break;

        case 'tutorial-3':
            //Add next paragraph
            scene.storyText.addToStory(
                `To create is a joy. To hold in your hands something you made is an unrivaled experience.`
            );
            break;

        case 'tutorial-4':
            //Show throw key
            mom.forEachByName('key-down', key => {
                key.setAlpha(1);
                key.setPosition(65 * 16, 6 * 16);
            });
            mom.forEachByName('key-right', key => {
                key.setAlpha(1);
                key.setPosition(66 * 16, 6 * 16);
            });
            break;

        case 'void-1':
            //Show the empty hole
            scene.cam.move(1120);
            //Add void paragraph 1
            let text = `But, before that, you still have to start with nothing. [nothing]An empty canvas. [canvas]The void. [show-void]`;
            scene.storyText.addToStory(text);
            scene.createCheckpoint(1160, 90, text, 6);
            break;
        
        case 'nothing':
            scene.bgman.setBackground('paper');
            break;
        case 'canvas':
            break;

        case 'show-void':
            //Show the void.
            scene.blackhole.toggleVisible(72, 6);
            //Pause for effect.
            await wait(2);
            //Add next paragraph.
            scene.storyText.addToStory(
                `The void is only scary until that pivotal moment when you get an idea. [idea1]`
            );
            break;
        case 'idea1':
            toggleVisible('idea-1');
            collideWithPlayer('idea-1');
            mom.forEachByName('void-wall', s => s.destroy());
            break;
        case 'idea2':
            toggleVisible('idea-2');
            collideWithPlayer('idea-2');
            break;
        case 'idea3':
            toggleVisible('idea-3');
            collideWithPlayer('idea-3');
            break;
        case 'idea4':
            toggleVisible('idea-4');
            collideWithPlayer('idea-4');
            break;
                
        case `idea-zone-1`:
            scene.storyText.addToStory(
                `From your first idea, smaller ideas [idea2]can flow naturally.`
            );
            break;
        case `idea-zone-2`:
            scene.storyText.addToStory(
                `You jump from idea [idea3]to idea. [idea4]`
            );
            break;
        
        case `idea-zone-3`:
            scene.storyText.addToStory(
                `Eventually, the void goes away, [hide-void]and you are left now with open possibility.[possibility]`
            )
            break;
        
        case 'hide-void':
            scene.blackhole.toggleVisible();
            break;

        case 'possibility':
            scene.cam.follow(scene.writer);
            scene.bgman.setBackground('mountains');
            break;

        case 'new-world-1':
            scene.storyText.addToStory(
                `Your new world is basic at first, but you've got the luxury of time. The story takes shape [shape]gradually. [new-world-1-done]`
            );
            scene.cam.move(90 * 16);
            break;

        case 'shape':
            break;
        case 'here':
            break;
        case 'there':
            break;
        case 'mind':
            break;

        case 'new-world-1-done':
            scene.cam.follow(scene.writer);
            break;

        case 'new-world-2':
            scene.storyText.addToStory(
                `Time and luxury, however, can be the death of motivation, soon an endless, empty desert. [new-world-2-done]`
            );
            scene.cam.move(110 * 16);
            break;
        
        case 'new-world-2-done':
            scene.cam.follow(scene.writer);
            break;

        case 'dead-line-1':
            scene.cam.move(2040);
            scene.storyText.addToStory(
                `Thus enters the deadline. [deadline1]When time and luxury become detrimental, then you must take them away. The deadline [deadline2]becomes a raw force, pushing [deadline3]until you have no choice. [deadline4]`
            );
            scene.createCheckpoint(2119, 137);
            scene.engageDeadline();
            break;

        case 'deadline1':
            scene.deadline.x = 2025;
            scene.deadline.jumpTo(2050);
            setTimeout(() => scene.deadline.setVelX(0), 1700);
            break;
        case 'deadline2':
            scene.deadline.setVelX(0.15);
            break;
        case 'deadline3':
            scene.deadline.jump(16);
            break;
        case 'deadline4':
            scene.deadline.setVelX(0.2);
            scene.storyText.addToStory(
                `Suddenly, you are able to build bridges. [bridge1]`
            )
            break;

        case 'burn1':
            break;

        case 'bridge1':
            mom.forEachByName('desert-wall', s => s.destroy());
            toggleVisible('bridge-1');
            collideWithPlayer('bridge-1-floor');
            scene.cam.follow(scene.writer);
            break;

        case 'giant-leaps-1':
            scene.storyText.addToStory(
                `Immersed fully in your task, your passion burning brightly. [burn1]Giant leaps become possible. You may hit snags, but the deadline [deadline5]keeps pushing you, and new ideas [idea-5]will come.`
            )
            scene.createCheckpoint(2473, 135);
            scene.deadline.jumpTo(scene.writer.x - 32);
            break;
            
        case 'deadline5':
            scene.deadline.jump(32);
            break;

        case 'idea-5':
            toggleVisible('idea-5');
            collideWithPlayer('idea-5');
            break;
        
        case 'giant-leaps-2':
            scene.storyText.addToStory(
                `Still, don't neglect your self. Take breaks. Put down your tools and let your thoughts flow unburdened. Just don't forget to pick things up again.`
            );
            break;

        case 'giant-leaps-3':
            scene.storyText.addToStory(
                `The deadline approaches faster, [deadline-faster]but breaks will give you vital energy. Find the balance and soon the end will be in sight. [end-in-sight]`
            );
            break;

        case 'deadline-faster':
                scene.deadLine.setVelX(0.3);
            break;

        case 'end-in-sight':
            mom.forEachByName('leaps-wall', s => s.destroy());
            break;
        case 'slow':
            break;
        
        case 'discipline-1':
            scene.storyText.addToStory(
                `Having come this far, you must finish. Finishing, of course, is the hardest part. You will need something more. Not a deadline. [deadline7]Not more rest, but discipline. [discipline]`
            );
            scene.deadline.jumpTo(scene.write.x - 32);
            scene.createCheckpoint(3176, 135);
            break;
        
        case 'discipline':
            mom.forEachByName('leaps-wall', s => s.destroy());
            break;
        
        case 'deadline7':
            scene.deadline.jumpTo(scene.writer.x - 32);
            setTimeout(() => scene.dead.line.destroy(), 1000);
            break;

        case 'discipline-2':
            scene.storyText.addToStory(
                `The key to unlock motivation is a mantra: Action almost always precedes motivation. When the joy is gone, no amount of rest will help, and to quit seems appealing, then you simply must act. Every small step brings more hope. [the-end]`
            );
            scene.bgman.setBackground('blueprint');
            break;
        
        case 'discipline-3':
            scene.storyText.addToStory(
                `The key to unlock motivation is a mantra: Action almost always precedes motivation. When the joy is gone, no amount of rest will help, and to quit seems appealing, then you simply must act. Every small step brings more hope. [the-end]`
            );
            scene.bgman.setBackground('blueprint');
            break;

        case 'the-end':
            mom.forEachByName('end-wall', s => s.destroy());
            scene.deadline.destroy();
            scene.storyText.addToStory(
                `Always remember that looking back, you will value the steep slopes for teaching you how to traverse them. The long and painful trail, in hindsight, will be a milestone that you will always cherish, maybe even more than the completed work itself. [final]`
            );
            break;
    
        case 'final':
            console.log('the-end-end');
            scene.add.sprite(scene.cameras.main.x, scene.cameras.main.y, 'thanks')
                .setScrollFactor(0)
                .setOrigin(0, 0);
            scene.storyText.addToStory('Respawns: ' + scene.deaths);
            break;

        case 'ded':
            scene.deaths += 1;
            scene.writer.setPosition(
                scene.spawns.playerSpawn.x,
                scene.spawns.playerSpawn.y,
            );
            scene.typewriter.setPosition(
                scene.spawns.typewriterSpawn.x,
                scene.spawns.typewriterSpawn.y,
            );

            if (scene.deadlineEngaged) {
                scene.deadline.x = scene.writer.x - 120;
                scene.deadline.jumpTo(scene.writer.x - 48);
            } else {
                scene.deadline.x = -100;
                scene.deadline.setVelX(0);
            }

            break;
    }

    function toggleVisible(names) {
        mom.forEachByName(names, s => {
            s.setAlpha(s.alpha === 0 ? 1 : 0)
        });
    }

    function collideWithPlayer(names) {
        mom.forEachByName(names, s => {
            scene.physics.add.existing(s);
            s.body.allowGravity = false;
            s.body.immovable = true; 
            scene.physics.add.collider(scene.writer, s);
            scene.physics.add.collider(scene.typewriter, s);
        });
    }
}

function wait(s) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    });
}