package xyz.xyzmax.Pirate;

import xyz.xyzmax.Pirate.Greeting;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * GreetingController
 */
@RestController
public class GreetingController {

    private static final String template = "Hello,%s!";
    private final AtomicLong counter = new AtomicLong();

    public GreetingController() {

    }

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Greeting(this.counter.incrementAndGet(), String.format(template, name));
    }
}