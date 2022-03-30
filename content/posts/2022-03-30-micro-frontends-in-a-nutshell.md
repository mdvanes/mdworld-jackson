---
title: "Micro Frontends In A Nutshell"
cover: ""
date: "30-03-2022"
category: "webdevelopment"
tags:
    - webdevelopment
---

# Micro Frontends In A Nutshell
You may have heard of a Micro Frontends recently and felt it a bit difficult to grasp what exactly it is and if it is something you should get involved in. I'll try to give a summary of the what, why, how, and when of the current state. To provide a high-over summary, I'll also add some recommended reading if you would like to get more details.

Why use Micro Frontends?

Do you have a very large front-end code-base? 

And by large, I'm talking about hundreds of developers in dozens of teams, probably cross-department, working on the same code-base in some manner. 
Do you have enterprise-scale continuous integration with e.g. GitLab, Bamboo running so many pipelines that the bottleneck is no longer a matter of adding more pods? 
Do you employ configuration managers or an Ops department to make sure deployments won't affect each other too much?
Do you have considerable codebases in incompatible front-end stacks, e.g. because of a migration from AngularJS to Angular >2?

Then chances are you need to use Micro Frontends. Or actually, you most probably are already using Micro Frontends.

What are Micro Frontends?

How is it possible you would not know you are using Micro Frontends? And why are we just now hearing so much about them? The truth is that although the term is relatively new it actually covers any range of solutions to integrate a collection of smaller frontends into one application.

Similar to Micro Service architectures, Micro Frontends facilitate large codebases by breaking them up into manageable pieces. This means:

Technological stack across Micro Frontends in the same application may differ
A Micro Frontend has a clear and concise purpose, following the SOLID principles
Teams of developers maintain one or more Micro Frontend that are isolated in runtime from the rest of the code

The term is now popularized because of the advent of Module Federation in Webpack 5. Webpack 5 has been released towards the end of 2020, but this new major release is taking some time to be integrated in relevant tooling, e.g. Nx and Ng CLI.

Note that Micro Frontends (MFEs) are sometimes also referred to as Micro Apps.

How do you build Micro Frontends?

Since Micro Frontends as a concept are not new, some solutions that can be classified as Micro Frontends are ancient, considering the speed of development in the frontend ecosystem. Here are some of them, to give an idea of how broad Micro Frontends can be interpreted:

Run several frontend applications on different URLs and cross refer them with plain hyperlinks
Run several frontend applications on different URLs on the same page in iframes
Develop frontend components in separate teams and integrate them at build time to be deployed as a deployment monolith
Use macro Web Components as an abstraction layer for components
Develop frontend components in separate teams and integrate them at runtime with Module Federation

I won't go into all the details about the pros and cons of each of these solutions. Instead I refer you to this article by my colleague Peter: https://dzone.com/articles/micro-frontends-by-example-8

Note that solutions can be combined: you can have a deployment monolith (that expects components that are all using the same stack) but wrap components in Web Components to provide an abstraction layer and use different stacks to produce the Web Components. Additionally, you can use Web Components in combination with Module Federation for instance if you are migrating towards Module Federation as a Micro Frontends solution.
Consider this schematic representation of a web application:


This could be implemented with different platforms like Angular and React by wrapping them in Web Components:



Module Federation is the newest solution and many libraries are still adapting to it. Last year, Nx 12 released with support for Webpack 5 and Module Federation. See a real working example here https://code-star.github.io/nx-reference-shell/ or its source in https://github.com/code-star/nx-reference.

Because Micro Frontends break up a codebase into smaller, more manageable fragments, they are often mentioned in combination with Monorepo solutions like Nx or yarn/npm workspaces. However, it is perfectly possible to implement Micro Frontends without monorepos!

When to use Micro Frontends?

New technology inspires developers to experiment, but Micro Frontends and with that Module Federation are not worth the upkeep for small to medium applications. All-in solutions like Next or Gatsby are great fits for smaller applications and custom Angular applications, when well organized, scale very well up to enterprise level.

However, no framework inherently supports older versions of itself. So if a big bang migration from AngularJS to Angular or any other framework for that matter, you'll end up with some kind of Micro Frontends solution. Plenty of enterprise codebases currently use some combination of hyperlinks and deployment monoliths.

This could look like a bank that offers a set of public pages (e.g. the general home page, and the landing pages of its departments) referencing each other with hyperlinks and a protected monolith app with many components (e.g. checking account, subscriptions to bank products, investments on one page).


Exploring Module Federation can be worth it if continuous integration are slowed down too much because of the large amounts of tests and compilation of all the involved components. But note that there are other approaches, such as using Nx monorepos with properly set up hierarchy and running only affected tests.

Another reason to use Module Federation can be the need to support multiple frameworks. Compared to Web Components, Module Federation improves the runtime isolation of components while simultaneously reducing isolation of shared dependencies to reduce the overall footprint of the application.

Compare to the diagram for the earlier example using macro Web Components, you can see that lodash, Angular and React are only loaded once, despite being used by multiple isolated components:



Call to action
Want to know more?

If you want to know more about Micro Frontends, Module Federation or Monorepos, you can contact us at [CONTACT INFO]. We have experience with enterprise frontend at all the major banks and many governmental departments in the Netherlands.

When you want more background information as a developer, you can also read the articles provided below.

Recommended in-depth reading:
Introduction to Micro Frontends: https://micro-frontends.org/
Introduction to Micro Frontends: https://martinfowler.com/articles/micro-frontends.html
Angular Architects 
Micro Frontends introduction: https://www.angulararchitects.io/en/aktuelles/a-software-architects-approach-towards/ 
Micro Frontends series: https://www.angulararchitects.io/en/aktuelles/micro-apps-with-web-components-using-angular-elements/ 
Module Federation series: https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/
Video: Micro Frontends: The What, the Why and the How by Peter Eijgermans https://youtu.be/TWcoziCdPkE
