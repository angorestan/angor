import app from "./app";
import auth from "./auth";
import docker from "./docker-image";
import filesystem from "./filesystem";
import traefik from "./traefik";
import upload from "./upload";

export default [app, auth, docker, filesystem, traefik, upload];
